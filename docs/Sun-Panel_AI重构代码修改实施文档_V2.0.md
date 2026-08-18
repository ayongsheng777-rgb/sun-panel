# Sun-Panel AI 重构代码修改实施文档 V2.0

> **目标仓库：** `ayongsheng777-rgb/sun-panel`  
> **原始基线：** `hslr-s/sun-panel`  
> **用途：** 直接交给 Codex / WorkBuddy / Claude Code 等编程智能体实施代码修改。  
>
> 本文不是产品需求说明，而是**代码级重构实施规范**。智能体必须先审计原项目，再按本文修改，不允许继续在现有 AI 代码上无边界打补丁。

---

# 1. 本次代码修改的核心目标

当前项目已经有 AI Provider、AI Search、AI Agent 等代码，但职责划分不合理。

例如当前 `service/lib/ai/search.go` 的 `AISearch()` 本质上是：

```text
本地网址候选召回
        ↓
AI重新排序
        ↓
返回 itemId
```

它不是互联网搜索引擎。当前代码明确要求 AI“不是联网搜索，也不是生成网址”，因此无法满足：

```text
最近抖音热门视频
今天洛杉矶天气
搜索几个开源 Docker 管理面板
最近 AI 新闻
搜索 GitHub 项目
```

等需求。

因此必须改造成：

```text
                         AI Engine
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
      Intent Router      Provider          Context
          │                 │                 │
   ┌──────┼────────┐        │          对话上下文
   │      │        │        │
Local   Web     Panel     OpenAI-compatible
Search  Search  Action
   │      │        │
   │   Realtime   CRUD/Settings
   │      │        │
   └──────┴────────┴──────────────┐
                                  ↓
                              Tool Registry
                                  ↓
                              Audit / Task
```

---

# 2. 修改优先级

严格按照以下顺序：

```text
P0：恢复原 Sun-Panel 所有功能
P1：修复 AdminPanel / 原配置 / 插件 / OpenAI 配置
P2：建立 AI Engine
P3：建立统一 AI Tool Registry
P4：统一顶部搜索与右下角 AI
P5：增加 Web / 实时搜索
P6：增加 AI 项目管理
P7：增加批量整理 / 全量分类
P8：测试、回归、性能优化
```

**不得跳过 P0/P1 直接继续增加 AI。**

---

# 3. 第一阶段：原项目基线审计

## 3.1 必须建立两个工作副本

```text
original/
    hslr-s/sun-panel

current/
    ayongsheng777-rgb/sun-panel
```

然后执行：

```bash
git diff
git log --stat
git diff --name-status
```

并按以下类别整理：

```text
CORE
ADMIN
SEARCH
PLUGIN
OPENAI
USER
AUTH
SECURITY
UI
AI
DATABASE
DOCKER
BUILD
```

---

# 4. 当前代码重点修改文件

优先检查：

```text
service/lib/ai/ai.go
service/lib/ai/search.go
service/lib/ai/agent.go
service/lib/ai/manage.go
service/lib/ai/config.go

service/api/api_v1/panel/aiAgent.go
service/api/api_v1/panel/aiManage.go
service/api/api_v1/panel/search.go

src/views/home/index.vue
src/components/deskModule/SearchBox/index.vue

src/views/home/components/AIAssistant/index.vue
src/views/home/components/AISearchConfig/index.vue
src/views/home/components/AdminPanel/index.vue
src/views/home/components/SecuritySetting/index.vue
src/views/home/components/EditItem/index.vue
src/views/home/components/AppIcon/index.vue

src/api/panel/aiAgent.ts
src/api/panel/aiManage.ts
src/api/panel/aiSearch.ts
src/api/admin.ts
```

---

# 5. 第二阶段：AI 目录重构

不要继续把所有 AI 逻辑堆在：

```text
service/lib/ai/agent.go
service/lib/ai/search.go
```

建议最终目录：

```text
service/lib/ai/
├── ai.go
├── config.go
├── engine.go
├── intent.go
├── context.go
├── result.go
│
├── provider/
│   ├── interface.go
│   ├── openai_compatible.go
│   └── manager.go
│
├── tools/
│   ├── registry.go
│   ├── types.go
│   ├── local_search.go
│   ├── web_search.go
│   ├── web_fetch.go
│   ├── weather.go
│   ├── time.go
│   ├── github.go
│   ├── panel.go
│   ├── settings.go
│   └── organize.go
│
├── action/
│   ├── executor.go
│   ├── validator.go
│   └── permission.go
│
├── task/
│   ├── manager.go
│   └── worker.go
│
└── audit/
    └── logger.go
```

---

# 6. AI Provider 改造

当前 `service/lib/ai/ai.go` 已经使用 OpenAI-compatible 协议，并且目前 Provider 主要是：

```go
ProviderDeepSeek
ProviderNvidia
ProviderCustom
```

这部分不要推倒重写。

改造成：

```go
type Provider string

const (
    ProviderOpenAI           Provider = "openai"
    ProviderDeepSeek         Provider = "deepseek"
    ProviderNvidia           Provider = "nvidia"
    ProviderGemini           Provider = "gemini"
    ProviderCustom           Provider = "custom"
)
```

但业务层统一依赖：

```go
type AIProviderAdapter interface {
    ListModels(ctx context.Context, cfg AIProviderConfig) ([]AIModel, error)
    Chat(ctx context.Context, cfg AIProviderConfig, messages []ChatMessage, wantJSON bool) (string, error)
    TestModel(ctx context.Context, cfg AIProviderConfig, model string) ModelTestResult
}
```

不要让业务层判断：

```go
if provider == deepseek
if provider == nvidia
```

---

# 7. Provider 配置必须兼容原有配置

建议扩充：

```go
type AIProviderConfig struct {
    Provider   Provider `json:"provider"`
    BaseURL    string   `json:"baseUrl"`
    APIKey     string   `json:"apiKey"`
    Model      string   `json:"model"`
    Enabled    bool     `json:"enabled"`
    Timeout    int      `json:"timeout"`

    Temperature float64 `json:"temperature,omitempty"`
    MaxTokens   int     `json:"maxTokens,omitempty"`

    ExtraHeaders map[string]string `json:"extraHeaders,omitempty"`
}
```

要求：

```text
旧配置可以继续使用
新字段全部有默认值
升级不能清空旧配置
```

---

# 8. ProviderManager 修改

增加：

```go
func (m ProviderManager) GetAdapter(cfg AIProviderConfig) AIProviderAdapter {
    switch cfg.Provider {
    case ProviderOpenAI,
         ProviderDeepSeek,
         ProviderNvidia,
         ProviderGemini,
         ProviderCustom:
        return OpenAICompatibleProvider{}
    default:
        return OpenAICompatibleProvider{}
    }
}
```

Gemini 如果实际 API 协议不同，单独实现：

```text
GeminiProvider
```

不要为了“统一”强行把不同协议塞进一个适配器。

---

# 9. 新增 AI Intent

新建：

```text
service/lib/ai/intent.go
```

代码结构：

```go
package ai

type IntentType string

const (
    IntentChat             IntentType = "chat"
    IntentLocalSearch      IntentType = "local_search"
    IntentWebSearch        IntentType = "web_search"
    IntentRealtime         IntentType = "realtime"
    IntentPanelAction      IntentType = "panel_action"
    IntentSettingsAction   IntentType = "settings_action"
    IntentOrganize         IntentType = "organize"
)

type Intent struct {
    Type       IntentType       `json:"type"`
    Query      string           `json:"query,omitempty"`
    Tool       string           `json:"tool,omitempty"`
    Params     map[string]any   `json:"params,omitempty"`
    Confidence float64          `json:"confidence,omitempty"`
}
```

---

# 10. Intent Router

新建：

```text
service/lib/ai/engine.go
```

核心：

```go
type Engine struct {
    Providers ProviderManager
    Tools     *ToolRegistry
}

func (e *Engine) Execute(
    ctx context.Context,
    cfg AIConfig,
    userID uint,
    prompt string,
) (AIResponse, error)
```

执行：

```text
prompt
 ↓
识别 Intent
 ↓
选择 Tool
 ↓
执行 Tool
 ↓
AI 汇总
 ↓
Response
```

---

# 11. Tool Registry

新建：

```text
service/lib/ai/tools/registry.go
```

定义：

```go
type Tool interface {
    Name() string
    Description() string
    Schema() any
    Execute(ctx context.Context, req ToolRequest) (ToolResult, error)
}
```

注册：

```go
registry.Register(LocalSearchTool{})
registry.Register(WebSearchTool{})
registry.Register(WebFetchTool{})
registry.Register(WeatherTool{})
registry.Register(TimeTool{})
registry.Register(GitHubTool{})

registry.Register(PanelListGroupsTool{})
registry.Register(PanelListItemsTool{})
registry.Register(PanelCreateGroupTool{})
registry.Register(PanelRenameGroupTool{})
registry.Register(PanelMoveItemTool{})
registry.Register(PanelEditItemTool{})
registry.Register(PanelAddItemTool{})
registry.Register(PanelReorderTool{})
registry.Register(PanelOrganizeTool{})

registry.Register(SettingsReadTool{})
registry.Register(SettingsUpdateTool{})
```

---

# 12. Tool 必须拥有权限声明

```go
type ToolPermission string

const (
    PermissionRead  ToolPermission = "read"
    PermissionWrite ToolPermission = "write"
    PermissionDelete ToolPermission = "delete"
)
```

AI 当前只允许：

```text
read
write
```

禁止：

```text
delete
```

任何 Tool 如果：

```go
Permission() == PermissionDelete
```

AI Engine 直接拒绝注册或执行。

---

# 13. 删除必须从 AI Tool 层彻底隔离

不要只依赖 Prompt：

```text
“AI不能删除”
```

必须在后端做第二层保险：

```go
func validateToolPermission(tool Tool) error {
    if tool.Permission() == PermissionDelete {
        return errors.New("AI delete operation is forbidden")
    }
    return nil
}
```

更进一步：

```text
AI Tool Registry
        ↓
没有 Delete Tool
```

这样最安全。

---

# 14. 现有 agent.go 改造

当前 `AgentExecute()` 已经支持：

```text
search
create_group
rename_group
reorder_groups
move_item
reorder_items
edit_item
reply
```

不要直接删除这些能力。

将这些 Action 迁移为 Tool：

```text
create_group
→ panel.create_group

rename_group
→ panel.rename_group

reorder_groups
→ panel.reorder_groups

move_item
→ panel.move_item

reorder_items
→ panel.reorder_items

edit_item
→ panel.edit_item
```

原接口可以暂时保留：

```go
func AgentExecute(...) (...)
```

内部改成：

```go
return Engine.Execute(...)
```

这样可以减少现有 API 破坏。

---

# 15. 本地搜索必须保留

当前：

```text
service/lib/ai/search.go
```

的：

```go
CandidateRecall()
AISearch()
LocalFilter()
FetchByIds()
```

不要删除。

改名/拆分为：

```text
tools/local_search.go
```

职责：

```text
LocalSearchTool
```

原功能：

```text
面板内部搜索
```

继续保留。

---

# 16. AI 搜索不再等于 Local AISearch

必须明确：

```text
LocalSearch
=
搜索我的 Sun-Panel

WebSearch
=
搜索互联网

AIAnswer
=
AI回答

Realtime
=
实时数据

PanelAction
=
操作我的 Sun-Panel
```

这是当前版本必须修正的架构错误。

---

# 17. Web Search Tool

新建：

```text
service/lib/ai/tools/web_search.go
```

定义：

```go
type SearchResult struct {
    Title       string    `json:"title"`
    URL         string    `json:"url"`
    Snippet     string    `json:"snippet"`
    Source      string    `json:"source"`
    PublishedAt *time.Time `json:"publishedAt,omitempty"`
    Score       float64   `json:"score,omitempty"`
}
```

接口：

```go
type SearchProvider interface {
    Search(ctx context.Context, query string, opts SearchOptions) ([]SearchResult, error)
}
```

---

# 18. SearchProvider 不允许锁死 Google

建议：

```text
SearchManager
├── Google
├── Bing
├── Brave
├── DuckDuckGo
└── Custom
```

配置：

```go
type SearchOptions struct {
    Limit      int
    TimeRange  string
    SafeSearch bool
}
```

自动 fallback：

```text
Provider 1
 ↓ fail
Provider 2
 ↓ fail
Provider 3
 ↓ fail
AI回答“暂时无法获取实时搜索结果”
```

不能卡死。

---

# 19. 天气 Tool

新建：

```text
service/lib/ai/tools/weather.go
```

接口：

```go
type WeatherTool struct {
    Provider WeatherProvider
}

type WeatherProvider interface {
    Current(ctx context.Context, location string) (WeatherResult, error)
    Forecast(ctx context.Context, location string, days int) ([]WeatherResult, error)
}
```

支持：

```text
今天北京天气
明天上海天气
洛杉矶天气
我这里天气
未来三天天气
```

不要通过 Google 搜索代替天气 API。

---

# 20. 时间 Tool

新建：

```text
service/lib/ai/tools/time.go
```

支持：

```text
现在几点
东京几点
纽约时间
北京时间
```

---

# 21. GitHub Tool

新建：

```text
service/lib/ai/tools/github.go
```

支持：

```text
搜索 GitHub 项目
搜索仓库
搜索开发工具
搜索开源项目
```

返回：

```go
type GitHubResult struct {
    Name        string `json:"name"`
    FullName    string `json:"fullName"`
    URL         string `json:"url"`
    Description string `json:"description"`
    Stars       int    `json:"stars"`
    Language    string `json:"language"`
}
```

---

# 22. 抖音热门视频

不允许写死：

```text
searchType == "douyin"
```

应该通过 Intent：

```text
“最近抖音热门视频”
```

识别：

```json
{
  "type": "web_search",
  "query": "抖音 最近 热门 视频",
  "params": {
    "timeRange": "recent",
    "contentType": "video"
  }
}
```

然后由 WebSearch Tool 搜索。

要求：

```text
有数据就返回
没有实时榜单就说明来源限制
禁止编造热度
禁止伪造视频链接
```

---

# 23. AI 聚合搜索

增加：

```text
service/lib/ai/tools/search_aggregate.go
```

流程：

```text
多个 SearchProvider
        ↓
统一 SearchResult
        ↓
URL 去重
        ↓
标题去重
        ↓
域名聚合
        ↓
AI排序
        ↓
AI总结
```

返回：

```go
type AggregateResult struct {
    Results []SearchResult `json:"results"`
    Summary string         `json:"summary"`
}
```

---

# 24. AI 添加网址

增加：

```text
panel.add_item
```

执行流程：

```text
AI确定网址
 ↓
URL合法性校验
 ↓
确定标题
 ↓
确定分组
 ↓
创建数据库记录
 ↓
尝试 favicon
 ↓
失败 → Iconify
 ↓
失败 → 类型图标
 ↓
失败 → 默认图标
 ↓
成功返回
```

**任何图标失败都不能回滚网址创建。**

---

# 25. URL 验证

新建：

```text
service/lib/ai/tools/url.go
```

必须：

```text
url.Parse()
scheme 校验
host 校验
长度校验
危险协议拒绝
```

允许：

```text
http
https
```

如果原项目支持其他地址类型，必须保持兼容。

禁止 AI 自动生成：

```text
javascript:
file:
data:
```

等危险协议。

---

# 26. AI 设置修改

新建：

```text
service/lib/ai/tools/settings.go
```

定义：

```go
type SettingDefinition struct {
    Key         string
    Type        string
    WritableByAI bool
    Validate    func(any) error
}
```

例如：

```go
"ai.enabled"
"ai.defaultProvider"
"ai.search.enabled"
"ai.search.timeout"
"ai.model"
```

但是：

```text
数据库连接
管理员密码
用户删除
系统密钥
```

等敏感字段：

```go
WritableByAI = false
```

---

# 27. AI 修改设置必须经过白名单

禁止：

```go
db.Model(&Setting{}).Where("key = ?", key).Update(...)
```

其中 `key` 直接来自 LLM。

必须：

```go
def, ok := AllowedSettings[key]
if !ok {
    return errors.New("setting is not writable by AI")
}
```

然后：

```go
def.Validate(value)
```

最后：

```text
Permission
↓
Validation
↓
Update
↓
Audit
```

---

# 28. Panel Action 必须优先使用 ID

当前 Agent 大量依赖：

```text
groupTitle
itemTitle
```

保留自然语言匹配，但执行阶段必须：

```text
LLM名称
 ↓
后端数据库匹配
 ↓
唯一ID
 ↓
执行
```

不能：

```text
LLM直接决定数据库对象
```

如果存在多个：

```text
找到多个匹配
 ↓
停止执行
 ↓
要求用户确认
```

---

# 29. 分组重复网址整理

新建：

```text
service/lib/ai/tools/organize.go
```

核心：

```go
type DuplicateCandidate struct {
    PrimaryID   uint
    DuplicateIDs []uint
    Reason      string
    Confidence  float64
}
```

URL 规范化：

```text
scheme
host
path
query
fragment
```

重点处理：

```text
尾部 /
www
大小写
明显 tracking 参数
```

但不要过度规范化导致误判。

---

# 30. “合并重复网址”禁止真正删除

例如：

```text
A
https://example.com

B
https://example.com/
```

AI 可以：

```text
保留 A
把 B 的有用描述/地址信息合并到 A
```

但：

```text
不能 DELETE B
```

应返回：

```text
发现重复网址 B
已将信息合并到 A
B 需要删除时，请用户在原生页面手动删除。
```

---

# 31. 全量重新分类

新建：

```text
panel.organize
```

接口：

```go
type OrganizePlan struct {
    Groups []ProposedGroup `json:"groups"`
    Moves  []MovePlan      `json:"moves"`
    Changes []ItemChange   `json:"changes"`
}
```

流程：

```text
读取全部网址
 ↓
读取全部分组
 ↓
AI分析
 ↓
生成 Plan
 ↓
后端校验 Plan
 ↓
执行 create/rename/move/reorder/edit
 ↓
禁止 delete
 ↓
审计
```

---

# 32. 建议增加 Dry Run

高级整理必须支持：

```text
dryRun = true
```

例如：

```text
用户：
重新整理所有网址
```

第一次：

```text
AI：
我分析后建议：

新增分组：
AI
Docker
NAS
开发
财经

移动：
15个网址 → AI
12个网址 → Docker
8个网址 → NAS

重复：
发现7组重复网址

是否执行？
```

如果用户：

```text
执行
```

才进行写操作。

如果用户明确：

```text
直接整理，不需要确认
```

则可以执行所有允许的非删除操作。

---

# 33. 批量任务异步化

增加：

```text
service/lib/ai/task/
```

定义：

```go
type TaskStatus string

const (
    TaskPending TaskStatus = "pending"
    TaskRunning TaskStatus = "running"
    TaskSuccess TaskStatus = "success"
    TaskFailed  TaskStatus = "failed"
)
```

接口：

```go
POST /api/ai/tasks
GET  /api/ai/tasks/:id
```

大型操作：

```text
全量分析
全量分类
大量网站验证
大量图标更新
```

必须后台执行。

---

# 34. 任务进度

返回：

```json
{
  "taskId": "abc123",
  "status": "running",
  "total": 312,
  "completed": 185,
  "failed": 3,
  "message": "正在分析网址"
}
```

前端显示：

```text
正在分析 185 / 312
```

---

# 35. Audit Log

保留现有：

```text
service/models/aiOperationLog.go
```

并扩展为：

```go
type AIOperationLog struct {
    UserID      uint
    TaskID      string
    Action      string
    TargetType  string
    TargetID    uint
    BeforeJSON  string
    AfterJSON   string
    Success     bool
    Error       string
    CreatedAt   time.Time
}
```

敏感字段不得记录：

```text
API Key
密码
Token
Cookie
```

---

# 36. AdminPanel 必须修复，而不是继续覆盖

当前：

```text
src/views/home/components/AdminPanel/index.vue
```

已经改成：

```text
AI配置
安全中心
权限清单
```

必须重新对照原项目。

最终：

```text
AdminPanel
├── 原管理功能
├── AI配置
├── AI权限
└── 安全
```

而不是：

```text
AdminPanel = AI管理
```

---

# 37. AI 配置页

`AISearchConfig` 不要再叫“AI Search Config”然后只配置搜索。

建议：

```text
AI 设置
├── AI总开关
├── 默认模型
├── Provider
├── API
├── Web搜索
├── 实时数据
├── GitHub
├── AI助手
├── AI管理
└── 高级设置
```

---

# 38. 顶部 SearchBox 修改

当前 SearchBox 必须保持原功能。

新增：

```text
普通搜索
AI模式
```

推荐：

```text
[搜索网址 / 输入问题................] [✨]
```

点击 AI：

```text
进入 AI Assistant
```

而不是把原 SearchBox 替换成 Google。

---

# 39. 右下角 AIAssistant

当前：

```text
AIAssistant
```

改成真正的：

```text
AI Assistant
```

必须支持：

```text
聊天
搜索
实时信息
网址管理
分组管理
设置
任务进度
```

底部增加：

```text
输入问题 / 输入操作...
```

而不是：

```text
两个固定搜索类别
```

---

# 40. 顶部 AI 与悬浮 AI 共用后端

禁止：

```text
SearchBox → 自己一套逻辑

AIAssistant → 另一套逻辑
```

必须：

```text
SearchBox
      ↓
AI API
      ↓
AI Engine
      ↑
AIAssistant
```

---

# 41. 新 AI API

建议：

```text
POST /api/ai/chat
```

请求：

```json
{
  "message": "最近抖音热门视频有哪些？",
  "conversationId": "xxx"
}
```

响应：

```json
{
  "type": "answer",
  "content": "我找到了一些近期热门内容……",
  "sources": [],
  "actions": [],
  "taskId": ""
}
```

---

# 42. Action Response

例如：

```json
{
  "type": "action",
  "content": "已将 Portainer 添加到 Docker 分组",
  "actions": [
    {
      "type": "panel.add_item",
      "success": true
    }
  ]
}
```

---

# 43. Search Response

例如：

```json
{
  "type": "search",
  "content": "我找到 6 个相关结果",
  "sources": [
    {
      "title": "Portainer",
      "url": "https://...",
      "source": "web"
    }
  ]
}
```

---

# 44. Realtime Response

天气：

```json
{
  "type": "realtime",
  "realtimeType": "weather",
  "data": {
    "location": "Los Angeles",
    "temperature": 25,
    "condition": "..."
  }
}
```

---

# 45. AI 上下文

新建：

```text
service/lib/ai/context.go
```

至少保存：

```go
type ConversationContext struct {
    ConversationID string
    UserID         uint
    LastResults    []SearchResult
    LastItems      []uint
    LastGroups     []uint
    LastIntent     IntentType
}
```

这样：

```text
用户：
找几个 Docker 管理工具

AI：
找到 Portainer、Dockge……

用户：
第一个加到 Docker 分组

```

能够理解：

```text
第一个 = LastResults[0]
```

---

# 46. AI 安全边界

AI 不允许：

```text
删除
数据库结构修改
系统账号删除
管理员权限提升
读取其他用户数据
读取 API Key
读取密码
读取 Token
```

尤其：

```text
userID
```

必须来自：

```text
登录 Session / JWT
```

不能来自 LLM 参数。

---

# 47. 多用户数据隔离

所有 AI Panel Tool 必须：

```go
WHERE user_id = currentUserID
```

禁止：

```go
userID := params["userId"]
```

然后直接执行。

用户身份必须由 API 上下文注入：

```go
ToolRequest.UserID
```

---

# 48. AI Action Schema

统一：

```go
type ActionRequest struct {
    Action string                 `json:"action"`
    Params map[string]interface{} `json:"params"`
}
```

但后端必须：

```text
Action白名单
↓
Schema验证
↓
权限
↓
用户ID
↓
执行
```

---

# 49. LLM Prompt 只负责“理解”

不要让 Prompt 承担安全责任。

错误：

```text
不要删除网址
```

正确：

```text
Prompt限制
+
Tool Registry没有Delete
+
Permission拒绝
+
Service层再校验
```

必须四层保护：

```text
LLM
 ↓
Intent
 ↓
Tool
 ↓
Business Service
 ↓
DB
```

---

# 50. 原生业务 Service 必须复用

AI 不应该自己写：

```go
db.Create(...)
db.Update(...)
```

建议：

```text
AI Tool
 ↓
ItemService
GroupService
SettingsService
 ↓
DB
```

这样：

```text
UI操作
AI操作
```

共用同一业务规则。

---

# 51. 建议新增 Service

```text
service/lib/panel/
├── item_service.go
├── group_service.go
├── settings_service.go
└── icon_service.go
```

例如：

```go
type ItemService struct {
    DB *gorm.DB
}

func (s *ItemService) Add(...)
func (s *ItemService) Update(...)
func (s *ItemService) Move(...)
func (s *ItemService) Reorder(...)
```

删除方法即使存在，也不要注册到 AI Tool。

---

# 52. AI URL 图标处理

创建网址：

```go
item, err := itemService.Add(...)
```

先成功：

```text
DB创建
```

再：

```text
favicon
```

不要：

```text
favicon
 ↓ fail
整个 Add rollback
```

最终：

```text
网址一定优先创建成功
```

---

# 53. AI 搜索错误处理

任何：

```text
Google
Bing
天气
GitHub
AI Provider
```

失败，都必须：

```text
局部失败
```

而不是：

```text
整个 AI Assistant 失败
```

例如：

```text
天气 API 失败
→ AI仍然可以回答普通问题
```

---

# 54. 超时设计

不要所有请求都：

```text
150s
```

建议：

```text
Local Search       3s
Weather            8s
Time               3s
Web Search         20s
AI Chat            60s
GitHub             20s
Batch Task         后台
```

所有 HTTP 请求都必须：

```go
context.WithTimeout(...)
```

---

# 55. 前端 API 重构

建议：

```text
src/api/ai/
├── chat.ts
├── search.ts
├── task.ts
└── settings.ts
```

不要继续：

```text
aiAgent.ts
aiManage.ts
aiSearch.ts
```

三套 API 各自发展。

旧 API 可以暂时保留兼容层：

```text
旧 API
 ↓
统一 AI Engine
```

---

# 56. 前端类型

新建：

```text
src/types/ai.ts
```

定义：

```ts
export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: AISource[]
  actions?: AIAction[]
}

export interface AISource {
  title: string
  url: string
  source: string
}

export interface AIAction {
  action: string
  success: boolean
  message?: string
}

export interface AITask {
  taskId: string
  status: 'pending' | 'running' | 'success' | 'failed'
  total: number
  completed: number
  failed: number
}
```

---

# 57. AdminPanel 回归要求

修改后必须测试：

```text
打开管理面板
关闭管理面板
切换菜单
加载原设置
保存原设置
加载 AI 设置
保存 AI 设置
加载安全设置
加载用户权限
```

特别测试：

```text
窗口高度
滚动
Modal
z-index
响应式
移动端
```

---

# 58. 不允许破坏移动端

AI Assistant / SearchBox 必须考虑：

```text
Android
iOS
手机浏览器
输入法弹出
软键盘遮挡
```

尤其：

```text
position: fixed
height: 100vh
overflow
```

要避免输入框被软键盘挡住。

---

# 59. AI 面板移动端

推荐：

```css
height: min(720px, calc(100dvh - 24px));
max-height: calc(100dvh - 24px);
```

使用：

```text
100dvh
```

而不是单纯：

```text
100vh
```

输入区域：

```text
position: sticky / flex-end
padding-bottom: env(safe-area-inset-bottom)
```

---

# 60. 构建要求

前端：

```bash
pnpm install
pnpm lint
pnpm type-check
pnpm build
```

后端：

```bash
go test ./...
go vet ./...
go build ./...
```

Docker：

```bash
docker build .
```

必须验证。

---

# 61. AI 单元测试

必须增加：

```text
intent_test.go
tool_registry_test.go
permission_test.go
local_search_test.go
web_search_test.go
organize_test.go
settings_test.go
```

---

# 62. 删除安全测试

必须有：

```go
func TestAICannotDeleteItem(t *testing.T)
func TestAICannotDeleteGroup(t *testing.T)
func TestAICannotDeleteUser(t *testing.T)
```

测试：

```text
Prompt删除
Action删除
伪造Delete Tool
伪造SQL
跨用户ID
```

全部必须失败。

---

# 63. AI 管理测试

至少：

```text
新建分组
改名
移动网址
修改网址
排序
添加网址
修改图标
修改设置
```

---

# 64. 全量整理测试

准备：

```text
100个网址
10个分组
5组重复
10个错分类
```

执行：

```text
全量分析
```

验证：

```text
没有数据丢失
没有Delete
分组合理
移动正确
任务最终完成
失败任务可追踪
```

---

# 65. 最终代码结构

最终推荐：

```text
service/
├── api/
│   └── api_v1/
│       └── panel/
│           └── ai.go
│
├── lib/
│   ├── ai/
│   │   ├── engine.go
│   │   ├── intent.go
│   │   ├── context.go
│   │   ├── result.go
│   │   ├── provider/
│   │   ├── tools/
│   │   ├── action/
│   │   ├── task/
│   │   └── audit/
│   │
│   └── panel/
│       ├── item_service.go
│       ├── group_service.go
│       ├── settings_service.go
│       └── icon_service.go
│
└── models/
    └── aiOperationLog.go

src/
├── api/
│   └── ai/
│       ├── chat.ts
│       ├── search.ts
│       ├── task.ts
│       └── settings.ts
│
├── types/
│   └── ai.ts
│
└── views/home/components/
    ├── AIAssistant/
    ├── AISearchConfig/
    └── AdminPanel/
```

---

# 66. 不允许的修改方式

智能体禁止：

```text
❌ 删除原功能重新实现
❌ 删除原 AdminPanel
❌ 用 AI 面板覆盖原管理面板
❌ 删除 OpenAI 配置
❌ 把所有搜索改成 Google
❌ 把 AI 限制成两个搜索类别
❌ LLM直接SQL
❌ AI直接DELETE
❌ LLM直接决定userId
❌ 为图标失败阻塞网址添加
❌ 用一个150秒超时解决所有问题
❌ 为AI修改大量原核心组件
❌ 为新增功能修改数据库原数据结构而不做迁移
```

---

# 67. 推荐的最小迁移方案

为了避免一次性大改导致项目再次失控，第一轮只做：

```text
1. 恢复原功能
2. 修复 AdminPanel
3. 恢复 OpenAI/插件配置
4. 保留现有 Agent API
5. 新建 AI Engine
6. 把现有 Agent Action 接入 Tool Registry
7. 把现有 LocalSearch 接入 LocalSearchTool
8. 增加 WebSearchTool
9. 增加 WeatherTool
10. 增加 GitHubTool
11. 统一 AIAssistant
```

确认稳定后再做：

```text
12. SettingsTool
13. OrganizeTool
14. BatchTask
15. 全量分类
```

---

# 68. 第一阶段不要动的东西

除非原项目对照发现已经被破坏，否则不要随便改：

```text
数据库核心表
原登录系统
原权限系统
原网址删除接口
原主题系统
原插件系统
原 Docker 部署
原用户系统
```

AI 通过 Service 层接入。

---

# 69. 实施时的代码审查规则

每修改一个原核心文件，都必须回答：

```text
1. 这个文件原来负责什么？
2. 原项目版本是什么？
3. 当前版本修改了什么？
4. 修改是否与AI直接相关？
5. 是否能把AI逻辑移到独立模块？
6. 是否破坏原功能？
```

如果答案是：

```text
AI逻辑可以独立
```

则必须独立。

---

# 70. 最终验收标准

## 原功能

```text
100%保留
```

## AI

```text
通用自然语言
```

## 搜索

```text
本地 + Web + 实时 + GitHub + 聚合
```

## 管理

```text
添加 + 修改 + 移动 + 排序 + 分类 + 设置
```

## 删除

```text
AI = 绝对禁止
用户原生UI = 保留
```

## 数据

```text
无丢失
```

## UI

```text
顶部AI + 悬浮AI = 同一Engine
```

---

# 71. 给 Codex / WorkBuddy 的执行指令

```text
你现在不是继续给 Sun-Panel 增加几个 AI 搜索按钮。

你的任务是：

第一步：
以 hslr-s/sun-panel 为原始产品基线，对 ayongsheng777-rgb/sun-panel 当前代码进行完整功能差异审计。

第二步：
恢复所有被当前 AI 改造破坏、简化、覆盖或隐藏的原功能、管理功能、插件功能、OpenAI 配置和搜索功能。

第三步：
保留当前已有 AI Agent 的有效能力，但不要继续堆在 agent.go/search.go 中。

第四步：
按照《Sun-Panel AI 重构代码修改实施文档 V2.0》建立：
AI Engine
Intent Router
Tool Registry
Provider
Action
Permission
Task
Audit

第五步：
把现有 AI Agent 的创建分组、改名、移动网址、排序、修改网址等能力迁移成 Tool，而不是删除重写。

第六步：
保留 LocalSearch，它只能负责搜索 Sun-Panel 内部数据。
新增 WebSearch，负责互联网搜索。
新增 Weather、Time、GitHub 等实时/专项工具。

第七步：
顶部搜索框和右下角 AI 助手必须统一调用 AI Engine。
不得再维护两个独立的 AI 搜索系统。
不得把 AI 固定成两个搜索类别。

第八步：
AI必须支持自然语言：
“最近抖音热门视频”
“今天洛杉矶天气”
“搜索几个开源Docker管理面板”
“搜索GitHub上的NAS项目”
等问题。

第九步：
AI必须支持项目管理：
“把Portainer添加到Docker分组”
“把这个网址移动到NAS”
“把开发工具分组改名”
“把这个分组里的重复网址整理”
“重新分析所有网址并重新分类”
“把AI模型改成xxx”

第十步：
AI只能执行Read/Write。
任何Delete Tool不得注册。
后端不得接受AI Delete Action。
原生用户删除功能必须完整保留。

第十一步：
任何AI批量操作必须经过：
Intent → Schema → Permission → Service → Database。
LLM绝不能直接SQL。

第十二步：
所有AI修改必须写Audit Log。
大型任务使用Task异步执行。

第十三步：
favicon失败不能阻塞网址创建。
搜索源失败必须fallback。
任何AI失败都不能影响Sun-Panel原生功能。

第十四步：
移动端必须处理100dvh、软键盘、输入框遮挡。

第十五步：
完成后执行：
pnpm lint
pnpm type-check
pnpm build
go test ./...
go vet ./...
go build ./...

最后输出：
原功能恢复报告
AI重构报告
文件修改清单
数据库迁移
API变化
测试结果
未解决问题

不要为了实现AI而破坏Sun-Panel。
AI是增量能力，不是替代原产品。
```

---

# 72. 本次重构最关键的代码原则

最终必须形成：

```text
                   Sun-Panel
                       │
              ┌────────┴────────┐
              │                 │
          原生业务层          AI Engine
              │                 │
        ┌─────┼─────┐      ┌────┼─────┐
        │     │     │      │    │     │
       Item  Group Setting Search Action
                            │
                 ┌──────────┼──────────┐
                 │          │          │
               Local       Web       Realtime
                 │          │          │
                 └──────────┼──────────┘
                            │
                         AI回答
```

**AI不替代原 Sun-Panel。**

**AI通过统一 Tool 层调用原有业务 Service。**

**原生功能是基础，AI是智能控制层。**

这是这次代码修改必须达到的最终架构。
