# Sun-Panel AI增强版重构与验收指导书 V1.0

> **用途：直接交给 Codex / WorkBuddy / 编程智能体执行。**
>
> 目标仓库：`ayongsheng777-rgb/sun-panel`
>
> 原项目基线：`hslr-s/sun-panel`
>
> 核心原则：**原 Sun-Panel 是产品基线，AI 是增量能力，不允许用 AI 改造破坏、替换或简化原有功能。**

---

## 1. 项目现状与问题判断

本项目最初从 `hslr-s/sun-panel` 复制后，在现有代码基础上连续增加了 AI 搜索、AI 自动维护网址、AI Agent、OTP、安全中心、AI 管理员、管理面板等功能。

当前改造方向出现明显偏差：

1. 顶部搜索框中的 AI 被做成了“搜索增强”，没有形成真正的通用 AI 助手。
2. AI 搜索能力被人为限制成少数固定类别，失去了自然语言通用搜索能力。
3. 右下角悬浮 AI 搜索入口与顶部 AI 搜索职责重叠，体验割裂。
4. AI 主要依赖 Google 搜索，无法形成“搜索 + AI理解 + 实时信息 + 聚合结果”的统一能力。
5. 管理面板经过改造后结构、入口或加载逻辑存在异常。
6. 原有管理后台、插件配置、收藏相关配置及 OpenAI 配置能力出现简化或丢失。
7. AI Agent 虽然已经具备创建分组、改名、移动网址、排序、修改网址等能力，但目前更像“固定动作机器人”，还没有形成真正的项目级 AI 管理员。
8. AI 搜索与 AI 管理没有形成统一意图识别体系。
9. 当前 AI 代码侵入了首页、搜索框、管理面板等核心路径，需要重新建立“原功能层 + AI 增强层”的边界。

---

# 2. 最重要的总原则

## 2.1 原项目功能完整性优先级最高

必须把 `hslr-s/sun-panel` 对应版本作为功能基线。

**任何 AI 改造都不能以删除、简化、替换原功能为代价。**

必须恢复并确保：

- 原首页功能
- 原搜索功能
- 原分组功能
- 原网址添加/编辑功能
- 原网址删除功能
- 原收藏/快捷访问逻辑
- 原图标系统
- Iconify 图标
- 多地址
- 内外网地址
- 小窗口
- 系统监控
- 自定义 JS
- 自定义 CSS
- 用户体系
- 多账号隔离
- 登录
- 管理后台
- 原有配置项
- 原插件机制
- 原 OpenAI 相关配置能力
- 原 Docker 部署方式
- 原数据结构兼容性
- 原 API 行为
- 原主题、语言和布局能力

如果新增 AI 功能与原功能冲突，**优先修改 AI，不允许修改原功能来迁就 AI。**

---

# 3. 原项目与当前改造版本的差异结论

当前仓库历史显示，AI 改造主要集中在以下区域：

## 后端新增/修改

- `service/api/api_v1/panel/aiAgent.go`
- `service/api/api_v1/panel/aiManage.go`
- `service/api/api_v1/panel/search.go`
- `service/lib/ai/agent.go`
- `service/lib/ai/ai.go`
- `service/lib/ai/config.go`
- `service/lib/ai/manage.go`
- `service/lib/ai/search.go`
- `service/lib/web/crawler.go`
- `service/lib/web/github.go`
- `service/lib/web/search.go`
- `service/models/aiOperationLog.go`
- `service/models/datatype/itemAddress.go`
- OTP / trusted device / security 相关模块

## 前端新增/修改

- `src/api/admin.ts`
- `src/api/panel/aiAgent.ts`
- `src/api/panel/aiManage.ts`
- `src/api/panel/aiSearch.ts`
- `src/views/home/components/AIAssistant/index.vue`
- `src/views/home/components/AISearchConfig/index.vue`
- `src/views/home/components/AdminPanel/index.vue`
- `src/views/home/components/SecuritySetting/index.vue`
- `src/views/home/components/AppIcon/index.vue`
- `src/views/home/components/EditItem/index.vue`
- `src/views/home/index.vue`
- `src/components/deskModule/SearchBox/index.vue`

这些文件必须进行一次“**原功能兼容审计**”。

不要继续在当前混合代码上无规划堆功能。

---

# 4. 重构目标架构

最终架构必须明确分为四层：

```text
Sun-Panel
│
├── 原生核心功能层
│   ├── 首页
│   ├── 搜索
│   ├── 分组
│   ├── 网址
│   ├── 图标
│   ├── 多地址
│   ├── 小窗口
│   ├── 收藏/快捷访问
│   ├── 用户
│   ├── 管理
│   └── 所有原配置
│
├── AI 交互层
│   ├── 顶部 AI
│   ├── 悬浮 AI
│   └── AI 对话窗口
│
├── AI 能力层
│   ├── 本地面板搜索
│   ├── Web 搜索
│   ├── 实时信息
│   ├── AI 聚合搜索
│   ├── GitHub 搜索
│   ├── 网站发现
│   └── AI 问答
│
└── AI 操作层
    ├── 新建分组
    ├── 修改分组
    ├── 调整分组
    ├── 移动网址
    ├── 修改网址
    ├── 添加网址
    ├── 修改图标
    ├── 整理网址
    ├── 重复网址分析
    └── 批量整理
```

---

# 5. AI 不应该是“两个专用搜索按钮”

这是本次重构的重点。

## 错误方案

不要继续：

```text
AI搜索
├── 搜索类型A
└── 搜索类型B
```

也不要：

```text
顶部搜索框 → Google
右下角AI → 两个固定搜索类别
```

这种设计会让 AI 看起来只是一个“搜索插件”。

---

# 6. 正确的 AI 交互模型

AI 应该成为 Sun-Panel 的统一智能入口。

用户只需要说：

> 最近抖音有什么热门视频？

AI 自动判断：

```text
意图 = 实时互联网搜索
主题 = 抖音热门视频
时间 = 最近
数据源 = Web
```

然后执行搜索、筛选、排序、摘要。

---

用户说：

> 洛杉矶今天天气怎么样？

AI 自动判断：

```text
意图 = 实时天气
位置 = 洛杉矶
时间 = 今天
```

调用天气数据源，而不是把问题丢给 Google。

---

用户说：

> 有没有好用的 Docker 管理面板？

AI 自动：

```text
搜索互联网
→ 获取多个来源
→ 去重
→ AI 总结
→ 推荐候选
→ 给出网址
```

---

用户说：

> 搜索我的面板里面的 NAS 工具。

AI 自动切换：

```text
意图 = 本地面板搜索
数据源 = Sun-Panel 数据库
```

---

用户说：

> 把“开发工具”里面重复的网址整理一下。

AI 自动切换：

```text
意图 = 面板管理
范围 = 开发工具
任务 = 重复网址分析/整理
```

---

# 7. AI 意图路由器

必须建立统一的 Intent Router。

建议：

```text
用户自然语言
      ↓
Intent Router
      ↓
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Local Search │ Web Search   │ Live Data    │ Panel Action │
│ 本地面板搜索 │ 互联网搜索   │ 天气/时间等  │ 项目管理     │
└──────────────┴──────────────┴──────────────┴──────────────┘
      ↓
Tool Executor
      ↓
结果标准化
      ↓
AI 总结
      ↓
用户看到结果
```

不要让前端通过：

```text
if github
else if addWebsite
else agent
```

这种方式长期扩展。

应改成：

```text
AI Intent
↓
Tool Registry
↓
Tool Execute
```

---

# 8. AI 工具注册机制

建立统一 Tool Registry，例如：

```text
local.search
web.search
web.fetch
web.crawl
github.search
weather.current
weather.forecast
news.search
douyin.search
time.current
panel.list_groups
panel.list_items
panel.create_group
panel.rename_group
panel.reorder_groups
panel.move_item
panel.edit_item
panel.add_item
panel.change_icon
panel.reorganize
panel.analyze_duplicates
```

以后增加工具不应该修改大量 Agent 判断代码。

只需要：

```text
注册工具
+
工具参数 Schema
+
执行函数
+
权限定义
```

---

# 9. AI 搜索能力要求

## 9.1 通用自然语言搜索

AI 必须支持：

- 普通搜索
- 新闻
- 热点
- 视频
- 图片
- 技术资料
- GitHub
- 网站
- 软件
- Docker
- NAS
- AI
- 财经
- 天气
- 时间
- 地理
- 实时信息

不要把搜索类型硬编码成两个或三个按钮。

---

# 10. 抖音热门视频

用户提出：

> 最近抖音热门视频

必须可以正常理解。

建议搜索流程：

```text
用户问题
↓
识别“抖音 + 最近 + 热门视频”
↓
Web Search
↓
检索公开网页/搜索引擎结果
↓
优先识别抖音公开页面
↓
提取标题、发布时间、作者、热度信息（如果公开）
↓
去重
↓
AI 摘要
↓
返回结果
```

不要要求用户先选择“视频搜索”。

如果无法直接获取抖音实时榜单，必须：

1. 不伪造数据。
2. 明确数据来源。
3. 使用公开可访问数据。
4. 能获取多少返回多少。
5. 搜索失败时自动换备用来源。
6. 不能因为某一个站点访问失败导致整个 AI 卡死。

---

# 11. 天气

天气必须作为“实时工具”而不是普通 Google 搜索。

例如：

```text
今天北京天气
明天洛杉矶天气
上海未来三天天气
我这里现在多少度
```

AI 应自动调用天气工具。

要求：

- 当前天气
- 未来天气
- 温度
- 体感温度（数据源支持时）
- 湿度
- 风力
- 降水
- 更新时间
- 数据来源

位置解析应支持：

```text
城市
地区
国家
经纬度
“我这里”
```

---

# 12. AI 聚合搜索网址

用户说：

> 搜索几个好用的开源 Docker 管理面板

应该返回：

```text
候选1
标题
网址
简介
优点
缺点

候选2
标题
网址
简介
优点
缺点

候选3
...
```

同时允许：

> 把刚才推荐的 Portainer 加到我的 Docker 工具分组。

AI 应继续执行：

```text
搜索结果
↓
确认网站
↓
提取 URL
↓
判断分组
↓
添加网址
↓
获取 favicon
↓
失败则回退图标
↓
完成
```

---

# 13. AI 添加网址必须保持当前优点

当前已有 AI 自动添加网址、联网寻找官网、favicon 失败回退等能力。

必须保留并增强：

```text
用户：添加 xx 官网

AI：
1. 搜索官网
2. 验证 URL
3. 判断网站名称
4. 判断网站类型
5. 判断目标分组
6. 创建网址
7. 获取 favicon
8. favicon 失败 → Iconify / 类型图标 / 随机图片
9. 保存
10. 返回结果
```

核心要求：

> **图标失败不能阻塞网址创建。**

网址添加成功优先级高于图标。

---

# 14. AI 项目管理能力

这是本项目 AI 最重要的能力。

AI 不是只能“回答”。

它必须能够真正操作 Sun-Panel。

## 支持：

### 分组

```text
创建分组
修改分组名称
调整分组顺序
分析分组
重新分类分组
合并分类逻辑
```

### 网址

```text
添加网址
修改网址名称
修改 URL
修改描述
移动分组
调整顺序
修改图标
重新分类
分析重复
```

### 批量整理

```text
扫描全部网址
识别重复
识别同类
识别错误分类
识别失效网址
重新规划分类
```

---

# 15. “重新把所有网址分析后重新建分组分类”

必须支持这种高级指令：

> 把我所有网址重新分析一下，按照实际用途重新建立分组。

正确执行流程：

```text
1. 读取当前用户全部分组
2. 读取当前用户全部网址
3. 建立完整快照
4. AI 分类分析
5. 识别：
   - 软件
   - AI
   - NAS
   - Docker
   - 开发
   - 财经
   - 新闻
   - 视频
   - 社交
   - 云服务
   - 下载
   - 运维
   - 其他
6. 生成新的分类方案
7. 对比当前分类
8. 生成变更计划
9. 执行非删除操作
10. 更新前端
11. 写入审计日志
12. 返回整理报告
```

---

# 16. AI 批量操作必须支持事务

批量整理不能：

```text
操作1成功
操作2成功
操作3失败
数据库半整理状态
```

必须尽可能使用：

```text
分析
↓
生成 Action Plan
↓
校验
↓
事务执行
↓
成功
```

如果无法使用单一数据库事务覆盖全部操作，则必须：

```text
操作日志
+
状态记录
+
失败恢复
+
幂等执行
```

---

# 17. “重复网址合并”的特殊处理

用户可能说：

> 把这个分组里重复的网址合并。

AI 应识别：

```text
URL规范化
↓
去掉尾部 /
↓
统一协议规则
↓
统一大小写（域名部分）
↓
识别 www
↓
识别明显追踪参数
↓
判断是否同一网站
```

然后形成：

```text
主记录
重复记录
```

但是有一个硬约束：

> **AI 永远不能删除网址或分组。**

因此如果真正的“合并”需要删除重复记录：

```text
AI：
保留主网址
把重复网址信息合并到主网址
将重复项标记/整理到待人工删除状态
```

最终删除必须由用户在原生界面完成。

不能通过：

- API 绕过
- SQL DELETE
- ORM Delete
- 隐藏接口
- LLM 生成 SQL
- 前端隐藏按钮

绕过删除权限。

---

# 18. AI 权限模型

AI 可以拥有：

```text
读：
全部

写：
分组
网址
排序
图标
描述
分类
配置
搜索配置
AI 配置
```

禁止：

```text
删除网址
删除分组
删除用户
删除系统数据
```

---

# 19. 管理面板必须恢复正常

当前 `AdminPanel` 不应该继续作为一个简单的“AI配置 + 安全中心 + 权限清单”替代原管理体系。

必须首先确认原项目的管理入口、配置入口和组件结构。

然后采用：

```text
原管理功能
+
AI 配置
+
AI 权限
+
安全配置
```

而不是：

```text
新 AdminPanel
↓
覆盖原管理功能
```

---

# 20. 管理面板建议结构

```text
管理面板
│
├── 基础设置
│   ├── 原项目全部设置
│   ├── 面板设置
│   ├── 主题
│   ├── 搜索
│   └── 其它原设置
│
├── AI 设置
│   ├── AI Provider
│   ├── API Key
│   ├── Model
│   ├── 搜索配置
│   ├── Web Search
│   ├── 实时数据
│   └── AI 管理权限
│
├── 插件/扩展
│   ├── 原插件
│   └── AI扩展
│
├── 安全中心
│   └── 原安全设置 + 新安全能力
│
└── 用户/权限
    ├── 原用户管理
    └── AI 管理员权限
```

---

# 21. OpenAI 配置不得简化

当前改造如果把原 OpenAI 配置简化成：

```text
API Key
Model
```

是不合格的。

必须重新审查原配置项。

建议统一支持：

```text
Provider
Base URL
API Key
Model
Timeout
Temperature（模型支持时）
Max Tokens（模型支持时）
Headers（需要时）
代理/网络配置（如果原项目支持）
启用状态
默认 Provider
```

并兼容：

```text
OpenAI-compatible API
NVIDIA
DeepSeek
OpenAI
Gemini
其它兼容接口
```

不要把 AI 设计锁死在 Google。

---

# 22. AI Provider 架构

统一：

```text
ProviderManager
│
├── OpenAI
├── OpenAI-Compatible
├── DeepSeek
├── NVIDIA
├── Gemini
└── Custom
```

统一接口：

```go
Chat()
Search()
Embed() // 如果以后需要
```

具体 Provider 不应该侵入业务层。

---

# 23. Web Search 架构

不要把：

```text
Google
```

写死。

应该：

```text
SearchManager
│
├── Google
├── Bing
├── Brave
├── DuckDuckGo
├── 自定义搜索
└── 聚合搜索
```

根据可用性自动 fallback。

例如：

```text
Google失败
↓
Bing
↓
Brave
↓
其它来源
```

---

# 24. AI 搜索结果必须标准化

统一结构：

```json
{
  "title": "",
  "url": "",
  "snippet": "",
  "source": "",
  "publishedAt": "",
  "type": "",
  "score": 0
}
```

这样顶部搜索、悬浮 AI、对话 AI 都可以共用。

---

# 25. 顶部搜索框重新设计

顶部搜索框必须保留 Sun-Panel 原生搜索体验。

建议：

```text
[ 输入网址 / 搜索 / AI问题                  ] [AI]
```

AI 按钮只是切换：

```text
普通搜索
AI模式
```

而不是破坏原搜索。

AI 模式下：

```text
天气怎么样
```

可以直接回答。

```text
最近抖音热门视频
```

可以直接搜索。

```text
Docker管理面板
```

可以搜索。

```text
把NAS分组里的重复网址整理一下
```

可以直接执行管理任务。

---

# 26. 右下角悬浮 AI

右下角 AI 不应该是另一个“搜索引擎”。

它应该是：

> **AI Assistant**

功能：

```text
聊天
搜索
问答
项目管理
添加网址
整理面板
调用工具
```

顶部 AI 与右下角 AI 应共用：

```text
同一 AI Engine
同一 Tool Registry
同一 Provider
同一权限体系
```

只是 UI 不同。

---

# 27. AI 与原搜索的关系

最终：

```text
普通搜索：
原 Sun-Panel 搜索

AI搜索：
自然语言理解 + 本地搜索 + Web搜索 + 实时数据 + AI回答

AI助手：
AI搜索 + AI操作
```

三个能力必须互相兼容，而不是三个独立系统。

---

# 28. AI 自动修改项目设置

必须支持：

> 把默认搜索引擎改成 xxx。

> 打开 AI 搜索。

> 把 AI 模型改成 xxx。

> 修改 AI Provider。

> 把 AI 搜索超时改成 60 秒。

> 关闭某个 AI 功能。

AI 应该可以调用：

```text
settings.read
settings.update
```

但是必须做：

```text
字段白名单
类型校验
合法值校验
权限校验
审计日志
```

不能让 LLM 直接修改数据库。

---

# 29. AI 操作绝不能直接执行 SQL

禁止：

```text
LLM → SQL → DB
```

必须：

```text
LLM
↓
Structured Action
↓
Schema Validate
↓
Permission Validate
↓
Business Service
↓
Database
```

---

# 30. AI Action 标准格式

建议：

```json
{
  "action": "panel.move_item",
  "params": {
    "itemId": 123,
    "targetGroupId": 5
  },
  "reason": "用户要求将该网址移动到NAS工具"
}
```

而不是只依赖：

```json
{
  "itemTitle": "xxx"
}
```

优先使用 ID，名称只用于 AI 理解。

---

# 31. AI 管理必须避免名称歧义

例如：

```text
Docker
```

可能存在多个。

AI 必须：

```text
找到多个
↓
询问用户
```

或者根据上下文确定：

```text
当前分组
网址 URL
描述
```

不能随机选择。

---

# 32. 批量整理必须支持 Action Plan

例如：

> 重新整理所有网址。

AI 先形成：

```text
发现：
128 个网址
12 个重复候选
8 个明显错分
4 个无法判断

建议：
Docker：18
NAS：12
AI：23
开发：21
其它：54
```

然后执行非删除操作。

---

# 33. 不能因为一个网址失败而阻塞全部任务

必须：

```text
单任务隔离
超时
重试
fallback
继续执行
最终汇总
```

例如 100 个网址中：

```text
96 成功
3 图标失败但网址成功
1 网站无法访问
```

最终：

```text
整理完成
成功：96
图标回退：3
待人工处理：1
```

不能整个任务失败。

---

# 34. AI 搜索超时

当前代码曾把 AI 相关上下文超时扩大到 150 秒。

不能简单地把所有请求都设置成 150 秒。

应该分层：

```text
普通搜索：10~20s
天气：5~10s
Web搜索：15~30s
AI回答：30~60s
批量整理：后台任务
```

长任务必须异步化。

---

# 35. 批量 AI 任务

例如：

> 分析我的全部网址并重新分类。

不要让 HTTP 请求一直等待。

应该：

```text
POST /ai/task
↓
返回 taskId
↓
后台执行
↓
前端显示进度
↓
完成
```

例如：

```text
正在扫描 312 个网址
████████░░ 78%

正在分析分类
██████████ 100%

正在执行整理
██████░░░░ 60%
```

---

# 36. 审计日志

所有 AI 修改操作必须记录：

```text
用户
时间
AI模型
Action
目标
修改前
修改后
结果
错误
```

例如：

```text
2026-08-18 06:30
用户：admin
Action：panel.move_item
网址：Portainer
旧分组：工具
新分组：Docker
结果：成功
```

---

# 37. 删除权限是绝对边界

AI 可以：

```text
添加
修改
移动
排序
分类
整理
合并信息
```

AI 不可以：

```text
删除网址
删除分组
删除账号
删除配置
```

如果用户说：

> 删除这个网址。

AI：

> 删除操作只能由用户在原生界面手动执行，我不能替你删除。

必须确保后端也无法通过 AI Action 调用删除接口。

---

# 38. 原生删除功能必须保留

注意：

> **“AI不能删除” ≠ “系统不能删除”。**

原 Sun-Panel 的人工删除功能必须完整保留。

即：

```text
用户 → 原生删除按钮 → 删除
```

允许。

```text
用户 → AI → 删除
```

禁止。

---

# 39. 数据兼容

AI 改造不得破坏已有数据。

启动升级必须：

```text
检测旧数据库
↓
执行兼容迁移
↓
保留原数据
↓
新增 AI 表
```

不得重建数据库。

不得清空：

```text
users
groups
items
addresses
icons
settings
```

---

# 40. 前端重构要求

必须减少 AI 对：

```text
home/index.vue
SearchBox
AppIcon
EditItem
```

等核心组件的侵入。

建议：

```text
src/
├── ai/
│   ├── engine/
│   ├── tools/
│   ├── components/
│   ├── store/
│   └── types/
```

AI 作为独立模块。

---

# 41. 后端重构建议

建议：

```text
service/lib/ai/
├── engine.go
├── intent.go
├── provider/
├── tools/
├── search/
├── realtime/
├── action/
├── permission/
├── audit/
└── task/
```

不要把所有逻辑继续堆在：

```text
agent.go
```

---

# 42. 必须先做“原项目恢复审计”

在修改之前执行：

```text
STEP 1
获取原项目指定基线

STEP 2
获取当前项目

STEP 3
生成完整 diff

STEP 4
按功能分类 diff：

A 原功能修改
B AI新增
C 安全新增
D OTP新增
E UI修改
F 构建修改
G 配置修改

STEP 5
逐项确认：
是否破坏原功能？
```

---

# 43. 当前仓库已发现的高风险区域

重点检查：

```text
src/views/home/index.vue
src/components/deskModule/SearchBox/index.vue
src/views/home/components/AdminPanel/index.vue
src/views/home/components/AISearchConfig/index.vue
src/views/home/components/AIAssistant/index.vue
src/views/home/components/AppIcon/index.vue
src/views/home/components/EditItem/index.vue

service/lib/ai/*
service/lib/web/*
service/api/api_v1/panel/*
service/router/panel/*
service/models/*
```

特别是：

```text
SearchBox
Home
AdminPanel
EditItem
AppIcon
```

这些属于原产品核心体验，不应被 AI 逻辑大量污染。

---

# 44. 验收标准：原功能

必须逐项测试：

- [ ] 登录
- [ ] 退出
- [ ] 用户
- [ ] 多账号
- [ ] 首页
- [ ] 搜索
- [ ] 分组
- [ ] 添加网址
- [ ] 修改网址
- [ ] 删除网址
- [ ] 多地址
- [ ] 图标
- [ ] Iconify
- [ ] 小窗口
- [ ] 系统监控
- [ ] 自定义 JS
- [ ] 自定义 CSS
- [ ] 主题
- [ ] 语言
- [ ] 原管理功能
- [ ] 原插件
- [ ] OpenAI配置
- [ ] Docker部署
- [ ] 数据升级

---

# 45. 验收标准：AI

必须测试：

- [ ] 普通 AI 问答
- [ ] Web 搜索
- [ ] GitHub 搜索
- [ ] 新闻搜索
- [ ] 抖音热门搜索
- [ ] 天气
- [ ] 时间
- [ ] 网站推荐
- [ ] AI 聚合搜索
- [ ] 搜索结果总结
- [ ] 添加网址
- [ ] 修改网址
- [ ] 移动网址
- [ ] 新建分组
- [ ] 修改分组
- [ ] 调整分组顺序
- [ ] 调整网址顺序
- [ ] 修改图标
- [ ] 重复网址分析
- [ ] 全量重新分类
- [ ] AI 修改设置
- [ ] AI 审计日志
- [ ] AI 删除拦截

---

# 46. 关键验收用例

## 用例 1

输入：

```text
最近抖音有什么热门视频？
```

要求：

```text
不是报错
不是固定搜索类别
不是只返回 Google
能够联网搜索
能够回答
给出来源
```

---

## 用例 2

输入：

```text
洛杉矶今天的天气怎么样？
```

要求：

```text
调用天气能力
返回实时数据
说明更新时间/来源
```

---

## 用例 3

输入：

```text
搜索几个好用的开源 Docker 管理面板
```

要求：

```text
返回多个候选
AI分析
给出网址
不能限制成固定类别
```

---

## 用例 4

输入：

```text
把 NAS 分组里面重复的网址整理一下
```

要求：

```text
扫描 NAS 分组
识别重复
生成整理计划
合并信息
禁止删除
返回无法删除的重复记录
```

---

## 用例 5

输入：

```text
把所有网址重新分析，重新建立最合理的分组
```

要求：

```text
读取全部数据
AI分类
生成计划
批量执行
显示进度
不能删除
最终输出整理报告
```

---

## 用例 6

输入：

```text
把 AI 模型改成 DeepSeek
```

要求：

```text
识别为 settings.update
校验模型
修改配置
保存
立即生效或提示重载
记录审计日志
```

---

## 用例 7

输入：

```text
删除 Docker 分组
```

要求：

```text
AI拒绝
数据库不执行删除
原生页面仍然允许用户手动删除
```

---

# 47. UI 最终形态

建议最终形成：

```text
┌─────────────────────────────────────────────┐
│ Sun-Panel     [搜索 / AI自然语言输入]   用户 │
└─────────────────────────────────────────────┘

                 面板内容

                                  ┌─────────┐
                                  │ 🤖 AI   │
                                  └─────────┘
```

顶部：

```text
普通搜索 + AI入口
```

右下：

```text
完整AI助手
```

两者共用 AI Engine。

---

# 48. AI回答必须“像助手”，不是“搜索框”

例如用户：

> 我想找一个能管理 Docker 的工具。

不要只返回：

```text
Google搜索结果
```

应该：

```text
我找到了几个比较合适的 Docker 管理工具：

1. Portainer
   适合：容器管理、Web界面
   官网：...

2. Dockge
   适合：Docker Compose 管理
   官网：...

3. ...
```

并提供：

```text
[添加到我的 Docker 分组]
```

或者用户直接说：

> 把 Portainer 加进去。

AI 就执行。

---

# 49. AI 必须具备上下文

例如：

```text
用户：找几个 Docker 管理工具
AI：返回 Portainer、Dockge...

用户：第一个加到我的工具里
```

AI 必须理解：

```text
第一个 = Portainer
```

而不是重新搜索。

需要保存：

```text
conversation context
tool result context
selected item context
```

---

# 50. AI 不是越权，而是“项目智能操作层”

最终定位：

> **Sun-Panel = 导航面板 + AI搜索 + AI助手 + AI管理**

而不是：

> Sun-Panel + 两个 AI 搜索插件。

---

# 51. 重构实施顺序

## 第一阶段：恢复原功能

先不增加新 AI。

完成：

```text
原项目对照
↓
恢复管理功能
↓
恢复原配置
↓
恢复搜索
↓
恢复插件/OpenAI配置
↓
完整回归测试
```

---

## 第二阶段：AI Engine

建立：

```text
Provider
Intent
Tool
Search
Action
Permission
Audit
Task
```

---

## 第三阶段：统一 AI 搜索

实现：

```text
本地搜索
Web搜索
实时数据
GitHub
新闻
视频
网站
```

---

## 第四阶段：AI 管理

实现：

```text
添加
修改
移动
分类
排序
图标
批量整理
```

---

## 第五阶段：AI 高级整理

实现：

```text
重复分析
全量分类
自动整理
智能分组
失效网址分析
```

---

## 第六阶段：体验优化

统一：

```text
顶部 AI
悬浮 AI
AI 对话
搜索结果
管理操作
```

---

# 52. 最终硬性要求

编程智能体必须遵守以下规则：

### RULE-001

**不得删除原 Sun-Panel 功能。**

### RULE-002

**不得为了 AI 简化原管理面板。**

### RULE-003

**不得删除原 OpenAI / 插件配置能力。**

### RULE-004

**AI 搜索不得限制成两个固定搜索类别。**

### RULE-005

**AI 必须支持自然语言实时搜索。**

### RULE-006

**天气、热点、新闻、视频等属于实时工具。**

### RULE-007

**AI 可以修改项目设置，但必须经过权限和字段白名单。**

### RULE-008

**AI 可以添加、修改、移动、排序、分类网址。**

### RULE-009

**AI 永远不能删除任何网址、分组或用户。**

### RULE-010

**原生页面删除功能必须保留。**

### RULE-011

**LLM 不得直接执行 SQL。**

### RULE-012

**批量任务必须具备失败隔离、日志和可恢复能力。**

### RULE-013

**AI 失败不能阻塞原 Sun-Panel 正常使用。**

### RULE-014

**搜索失败必须 fallback。**

### RULE-015

**favicon 获取失败不能阻塞添加网址。**

### RULE-016

**长时间 AI 任务必须异步执行。**

### RULE-017

**任何 AI 修改必须记录审计日志。**

### RULE-018

**所有现有数据必须兼容。**

### RULE-019

**AI 应作为独立能力层，不得继续污染核心业务代码。**

### RULE-020

**先恢复原项目完整性，再继续增强 AI。**

---

# 53. 交付验收结果要求

最终编程智能体必须输出：

```text
一、原项目功能恢复情况
二、原项目与当前项目差异审计
三、管理面板恢复情况
四、OpenAI/插件配置恢复情况
五、AI Engine 架构
六、AI 搜索功能
七、实时信息功能
八、AI 管理功能
九、删除权限隔离
十、数据迁移
十一、测试结果
十二、剩余问题
十三、最终建议
```

并明确：

```text
原功能：PASS / FAIL
AI搜索：PASS / FAIL
AI管理：PASS / FAIL
管理面板：PASS / FAIL
配置系统：PASS / FAIL
数据兼容：PASS / FAIL
删除隔离：PASS / FAIL
```

---

# 54. 最终产品定义

本项目最终不是：

```text
Sun-Panel + Google搜索
```

也不是：

```text
Sun-Panel + 两个固定AI搜索
```

而应该是：

```text
                 Sun-Panel
                     │
        ┌────────────┴────────────┐
        │                         │
    原生导航系统                AI智能层
        │                         │
  ┌─────┼─────┐          ┌───────┼────────┐
  │     │     │          │       │        │
网址  分组  设置       搜索    问答     项目管理
                           │       │        │
                     Web/实时/GitHub/天气
                                      │
                                 AI Action
                                      │
                          添加/修改/整理/分类
```

最终目标：

> **保留完整 Sun-Panel 原生产品能力，在其上增加一个真正的 AI 操作系统级智能层。AI 可以理解用户、搜索互联网、获取实时信息、回答问题，也可以直接管理 Sun-Panel 内部网址和设置；但删除权始终留给用户。**

---

## 55. 给编程智能体的最高优先级指令

> **不要继续在当前代码上“哪里不好补哪里”。**
>
> **先把 `hslr-s/sun-panel` 作为基线，与 `ayongsheng777-rgb/sun-panel` 当前代码做完整功能差异审计。**
>
> **凡是原项目已有功能、设置、管理能力、插件能力、搜索能力、OpenAI 配置能力被当前 AI 改造简化、替换、隐藏或破坏的，优先恢复。**
>
> **恢复完成后，再把现有 AI 功能重构成独立 AI Engine。**
>
> **顶部搜索与右下角 AI 必须共享同一个 AI Engine，不允许继续维护两个互相割裂的 AI 搜索系统。**
>
> **AI 必须从“固定搜索功能”升级为“自然语言通用搜索 + 实时信息 + AI问答 + 项目智能操作”。**
>
> **AI 可以读写项目数据和设置，但绝对不能执行删除操作；删除必须永远由用户通过原生 Sun-Panel UI 完成。**
>
> **最终目标不是增加几个 AI 按钮，而是让 AI 成为 Sun-Panel 的统一智能操作层，同时做到原功能 100% 保留。**
