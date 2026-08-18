// Package tools 是 Sun-Panel AI 的工具注册表（Tool Registry）。
//
// 设计要点（对应实施文档 V2.0 §9-16、§49-50）：
//  1. 每个工具显式声明 Permission()，删除类权限被永久禁用；
//  2. 注册期（Register）+ 执行期（Execute）双重校验，任何 PermissionDelete 工具都无法进入注册表，
//     即使被强行构造也无法执行；
//  3. 本包**不依赖** lib/ai，避免循环引用。需要 LLM 能力的工具通过 ExecContext.LLM 注入调用。
package tools

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"sort"
	"strings"
	"sync"
)

// Permission 工具权限级别
type Permission string

const (
	PermissionRead   Permission = "read"   // 只读：查询/分析/生成方案
	PermissionCreate Permission = "create" // 新建：分组/网址
	PermissionUpdate Permission = "update" // 修改：改名/排序/移动/编辑
	PermissionDelete Permission = "delete" // 【永久禁用】删除类，不允许注册也不允许执行
)

// ErrDeletePermissionForbidden 删除权限被硬性拒绝
var ErrDeletePermissionForbidden = errors.New("删除类操作已被系统永久禁用，AI 无法执行；请在页面上手动删除")

// LLMFunc 由 lib/ai 注入的大模型调用函数（避免 tools 反向依赖 ai 包）
type LLMFunc func(ctx context.Context, systemPrompt, userPrompt string, wantJSON bool) (string, error)

// Result 工具统一返回
type Result struct {
	Kind    string         `json:"kind"`    // reply | items | changed | data
	Reply   string         `json:"reply"`   // 给用户看的一句话说明
	ItemIds []uint         `json:"itemIds"` // kind=items 时命中的网址 id（按相关度排序）
	Changed bool           `json:"changed"` // 面板数据是否变更（前端据此刷新）
	Data    map[string]any `json:"data"`    // kind=data 时的结构化载荷
}

// ExecContext 工具执行上下文
type ExecContext struct {
	Ctx    context.Context
	UserId uint
	Prompt string          // 用户原始指令
	Params json.RawMessage // LLM 给出的参数（原始 JSON）
	LLM    LLMFunc         // 可选：需要模型能力时使用
}

// Bind 把 Params 反序列化到 v，参数缺失时不报错（由各工具自行校验必填项）
func (ec *ExecContext) Bind(v any) {
	if len(ec.Params) == 0 {
		return
	}
	_ = json.Unmarshal(ec.Params, v)
}

// Tool 工具接口
type Tool interface {
	Name() string                   // 唯一名称，如 panel.create_group
	Description() string            // 给 LLM 看的能力描述
	ParamsSchema() map[string]string // 参数名 -> 说明（用于生成 Prompt）
	Permission() Permission          // 权限声明
	Execute(ec *ExecContext) (Result, error)
}

// ValidateToolPermission 第 2 层防线：拒绝任何删除类权限工具
func ValidateToolPermission(t Tool) error {
	switch t.Permission() {
	case PermissionRead, PermissionCreate, PermissionUpdate:
		return nil
	case PermissionDelete:
		return fmt.Errorf("工具 %s 声明了 delete 权限：%w", t.Name(), ErrDeletePermissionForbidden)
	default:
		return fmt.Errorf("工具 %s 声明了未知权限 %q", t.Name(), t.Permission())
	}
}

// Registry 工具注册表（并发安全）
type Registry struct {
	mu    sync.RWMutex
	tools map[string]Tool
}

// NewRegistry 创建空注册表
func NewRegistry() *Registry {
	return &Registry{tools: make(map[string]Tool)}
}

// Register 注册工具。删除类权限直接拒绝（第 2 层防线）
func (r *Registry) Register(ts ...Tool) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, t := range ts {
		if t == nil {
			continue
		}
		if err := ValidateToolPermission(t); err != nil {
			return err
		}
		name := strings.TrimSpace(t.Name())
		if name == "" {
			return errors.New("工具名称不能为空")
		}
		if _, dup := r.tools[name]; dup {
			return fmt.Errorf("工具 %s 重复注册", name)
		}
		r.tools[name] = t
	}
	return nil
}

// MustRegister 注册失败即 panic（仅用于启动期内置工具，能在编译/启动阶段暴露越权工具）
func (r *Registry) MustRegister(ts ...Tool) {
	if err := r.Register(ts...); err != nil {
		panic(err)
	}
}

// Get 取工具
func (r *Registry) Get(name string) (Tool, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	t, ok := r.tools[strings.TrimSpace(name)]
	return t, ok
}

// List 按名称排序返回全部工具
func (r *Registry) List() []Tool {
	r.mu.RLock()
	defer r.mu.RUnlock()
	out := make([]Tool, 0, len(r.tools))
	for _, t := range r.tools {
		out = append(out, t)
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Name() < out[j].Name() })
	return out
}

// Names 全部工具名
func (r *Registry) Names() []string {
	list := r.List()
	out := make([]string, 0, len(list))
	for _, t := range list {
		out = append(out, t.Name())
	}
	return out
}

// Execute 执行工具：执行期再次校验权限（第 3 层防线）
func (r *Registry) Execute(name string, ec *ExecContext) (Result, error) {
	t, ok := r.Get(name)
	if !ok {
		return Result{}, fmt.Errorf("未注册的工具：%s", name)
	}
	if err := ValidateToolPermission(t); err != nil {
		return Result{}, err
	}
	if ec == nil {
		return Result{}, errors.New("缺少执行上下文")
	}
	if ec.Ctx == nil {
		ec.Ctx = context.Background()
	}
	return t.Execute(ec)
}

// PromptSpec 生成给 LLM 的工具清单文本（供意图路由 Prompt 使用）
func (r *Registry) PromptSpec() string {
	var sb strings.Builder
	for _, t := range r.List() {
		sb.WriteString("- \"")
		sb.WriteString(t.Name())
		sb.WriteString("\"：")
		sb.WriteString(t.Description())
		schema := t.ParamsSchema()
		if len(schema) > 0 {
			keys := make([]string, 0, len(schema))
			for k := range schema {
				keys = append(keys, k)
			}
			sort.Strings(keys)
			sb.WriteString(" params: {")
			for i, k := range keys {
				if i > 0 {
					sb.WriteString(", ")
				}
				sb.WriteString("\"" + k + "\": " + schema[k])
			}
			sb.WriteString("}")
		}
		sb.WriteString("\n")
	}
	return sb.String()
}
