# Sun-Panel v1.8.1 PRO 功能 → 可编译源码重建与去授权依赖改造规格书

> **项目目标**：以 `sun-panel_v1.8.1_linux_amd64.tar.gz` 为逆向分析样本，结合其 ELF 调试信息、Go 符号、前端 Vite chunk 和运行时字符串，建立一套可落地的源码级重建方案。
>
> **目标结果**：在自己的 Sun-Panel Fork / 可维护源码树中重新实现以下 9 类功能，并将功能授权判断改造成项目自身的 Feature Flag，而不是依赖原 PRO 授权服务。
>
> **重要边界**：发布包中的后端是 Go ELF，并非原始 `.go` 源码。因此本文将“二进制中可确认的事实”和“为了可编译而重新设计的源码实现”明确区分。不要把反编译伪代码直接当作原作者源码。

---

## 0. 执行摘要

本次样本分析得到一个非常有利的结果：

```text
sun-panel v1.8.1
├── web/
│   ├── index.html
│   ├── static/
│   └── assets/*.js
└── sun-panel                  # ELF 64-bit x86-64
```

该 ELF：

```text
ELF 64-bit LSB executable, x86-64
dynamically linked
not stripped
BuildID:
cec93ddeb55f46ea1a5bb46e5541fcf526e4f3de
Go:
go1.23.2 linux/amd64
```

更重要的是，它**没有被 strip 掉**，并保留了大量 Go 符号和 DWARF 信息。

因此：

```text
原始 Go 源码
     │
     ├─ 不存在于发布包中
     ▼
Go ELF + DWARF + 符号 + 字符串 + 前端 chunk
     │
     ├─ 可以确认模块边界
     ├─ 可以确认函数名
     ├─ 可以确认源码文件路径
     ├─ 可以确认部分源码行号
     ├─ 可以确认 DTO / Model 字段
     ├─ 可以确认 API 路径
     └─ 可以重建等价实现
```

推荐不要采用“修改 ELF 指令强行放开 PRO”的路线。

推荐：

```text
v1.8.1 二进制
       ↓
功能行为 / API / Model / 文件结构分析
       ↓
自己的源码树
       ↓
重新实现功能
       ↓
Feature Entitlement 重构
       ↓
本地编译
       ↓
功能测试
```

---

# 1. 9 项 PRO 功能最终重建矩阵

| # | 功能 | v1.8.1 前端证据 | v1.8.1 后端证据 | 重建难度 | 建议 |
|---|---|---|---|---|---|
| 1 | 在线 CSS / JS | `index-BGbQJZJY.js` | `GlobalSettingApi` | ★★ | 直接重建 |
| 2 | 多账号无限制 | `index-B3_LCu7X.js` | `UsersApi` | ★★ | 直接重建 |
| 3 | 品牌信息 | `index-BGbQJZJY.js` | `GlobalSettingApi` + `SystemSetting` | ★★ | 直接重建 |
| 4 | Docker 管理 | `index-39mBaDH5.js` / `index-CZz6aXaE.js` | `docker.Container` | ★★★ | 调 Docker SDK |
| 5 | 自定义搜索引擎 | `index-CZz6aXaE.js` | `UserConfig.SearchEngine*` | ★★ | 直接重建 |
| 6 | 图形验证码 | `index-DZxLZB07.js` | `CaptchaApi` + `lib/captcha` | ★★ | 使用同类开源库重新实现 |
| 7 | 多账号快速切换 | `index-CZz6aXaE.js` | `UsersApi.Get/SetPublicVisitUser` | ★★ | 直接重建 |
| 8 | 公共图库 | `index-TZ20XPVQ.js` | `PublicGalleryApi` + `File.IsPublicGallery` | ★★ | 直接重建 |
| 9 | 备份 / 迁移 | `index-xBob14gZ.js` | `BackupApi` + `BackupType` | ★★★ | 按现有 SQLite / 文件布局重建 |

---

# 2. PRO 授权依赖闭包

## 2.1 原 v1.8.1 授权核心

ELF 中明确存在：

```text
sun-panel/biz.NewProAuth
sun-panel/biz.(*ProAuthType).Start
sun-panel/biz.(*ProAuthType).Register
sun-panel/biz.(*ProAuthType).Login
sun-panel/biz.(*ProAuthType).AutoLogin
sun-panel/biz.(*ProAuthType).RenewTempAuth
sun-panel/biz.(*ProAuthType).Ping
sun-panel/biz.(*ProAuthType).RefreshInfo
sun-panel/biz.(*ProAuthType).Reset
sun-panel/biz.(*ProAuthType).GetStatus
sun-panel/biz.(*ProAuthType).ProIsExpired
sun-panel/biz.(*ProAuthType).TempAuthIsExpired
sun-panel/biz.(*ProAuthType).GetHideProBadgeStatus
sun-panel/biz.(*ProAuthType).SetHideProBadgeStatus
sun-panel/router/panel.InitProAuthRouter
```

同时存在：

```text
sun-panel/api/api_v1/openness.(*Openness).ProIsExpired
```

前端也存在：

```text
/panel/proAuth/*
/openness/proIsExpired
```

以及 Pinia：

```text
proAuthorize
    ├── isExpired
    ├── hideProBadge
    └── refreshProAuthStatus()
```

---

## 2.2 真正需要移除的不是“一个 if”

PRO 授权实际上形成：

```text
ProAuthType
   │
   ├── 本地授权状态
   ├── 账号 / token
   ├── expiration
   ├── refresh
   ├── ping
   └── ProIsExpired()
             │
             ├──────────────┐
             ▼              ▼
        前端 Pinia       后端 API
             │              │
             ├─ 用户数量     ├─ 用户
             ├─ 搜索引擎     ├─ CSS/JS
             ├─ Docker UI   ├─ Backup
             ├─ Gallery UI  └─ 其他 PRO API
             └─ Upload UI
```

所以迁移时应当把：

```text
ProIsExpired()
```

替换成：

```text
FeatureEnabled("xxx")
```

而不是把：

```go
if ProIsExpired() {
    return ErrorNoPro
}
```

全部机械删除。

这样以后仍然可以控制某个功能。

---

# 3. 推荐的新授权 / Feature 架构

## 3.1 新接口

新建：

```text
service/biz/feature.go
service/api/api_v1/middleware/feature.go
```

核心模型：

```go
type Feature string

const (
    FeatureCustomCode       Feature = "custom_code"
    FeatureMultiUser        Feature = "multi_user"
    FeatureBranding         Feature = "branding"
    FeatureDocker           Feature = "docker"
    FeatureCustomSearch     Feature = "custom_search"
    FeatureCaptcha          Feature = "captcha"
    FeatureAccountSwitcher  Feature = "account_switcher"
    FeaturePublicGallery    Feature = "public_gallery"
    FeatureBackupMigration  Feature = "backup_migration"
)
```

统一判断：

```go
type FeatureService struct {
    flags map[Feature]bool
}

func (s *FeatureService) Enabled(feature Feature) bool {
    enabled, ok := s.flags[feature]
    return ok && enabled
}
```

如果你的 Fork 永久开放全部功能，可以默认：

```go
var DefaultFeatures = map[Feature]bool{
    FeatureCustomCode:      true,
    FeatureMultiUser:       true,
    FeatureBranding:        true,
    FeatureDocker:          true,
    FeatureCustomSearch:    true,
    FeatureCaptcha:         true,
    FeatureAccountSwitcher: true,
    FeaturePublicGallery:   true,
    FeatureBackupMigration: true,
}
```

---

# 4. 数据库结构

## 4.1 `SystemSetting`

DWARF 明确恢复：

```text
sun-panel/models.SystemSetting
size = 40
```

字段：

```text
ID
ConfigName
ConfigValue
```

因此：

```text
SystemSetting
┌──────────────┬──────────────┐
│ ID           │ integer      │
│ ConfigName   │ string       │
│ ConfigValue  │ string       │
└──────────────┴──────────────┘
```

这是整个系统设置的重要存储入口。

---

# 5. 品牌设置 Model

ELF 中明确存在：

```text
sun-panel/biz.GlobalSettingSiteSetting
```

字段：

```text
FaviconUrl
Title
LoginBackgroundUrl
IsEnableLoginCaptcha
IsDisableItemCardCache
```

布局：

```text
offset 0   FaviconUrl
offset 16  Title
offset 32  LoginBackgroundUrl
offset 48  IsEnableLoginCaptcha
offset 49  IsDisableItemCardCache
```

API DTO：

```text
GlobalSettingSite
    └── GlobalSettingSiteSetting
```

---

# 6. CSS / JS 数据结构

ELF 中明确存在：

```text
sun-panel/api/api_v1/common/apiData/panelApiStructs.GlobalSettingCustomJsAndCss
```

字段：

```text
JsContent
CssContent
```

前端实际使用：

```text
getCustomJsAndCssCode
saveCustomJsAndCssCode
```

后端还存在：

```text
getCustomPath()
createAndWriteFile()
PathExists()
os.MkdirAll()
```

因此 CSS / JS 推荐采用：

```text
conf/custom/
├── custom.js
└── custom.css
```

而不是把大段代码全部放进 SQLite。

---

# 7. CSS / JS 重建方案

## 7.1 API

```http
GET /panel/globalSetting/getCustomStylePath

GET /panel/globalSetting/getCustomJsAndCssCode

POST /panel/globalSetting/saveCustomJsAndCssCode
```

DTO：

```go
type GlobalSettingCustomJsAndCss struct {
    JsContent  string `json:"jsContent"`
    CssContent string `json:"cssContent"`
}
```

## 7.2 后端实现建议

```go
func (a *GlobalSettingApi) GetCustomJsAndCssCode(c *gin.Context) {
    js, _ := os.ReadFile(filepath.Join(customDir, "custom.js"))
    css, _ := os.ReadFile(filepath.Join(customDir, "custom.css"))

    apiReturn.SuccessData(c, map[string]string{
        "jsContent":  string(js),
        "cssContent": string(css),
    })
}
```

保存：

```go
func (a *GlobalSettingApi) SaveCustomJsAndCssCode(c *gin.Context) {
    var req GlobalSettingCustomJsAndCss

    if err := c.ShouldBindJSON(&req); err != nil {
        apiReturn.ErrorParamFomat(c, err)
        return
    }

    if err := os.MkdirAll(customDir, 0755); err != nil {
        apiReturn.Error(c, err)
        return
    }

    if err := os.WriteFile(
        filepath.Join(customDir, "custom.js"),
        []byte(req.JsContent),
        0644,
    ); err != nil {
        apiReturn.Error(c, err)
        return
    }

    if err := os.WriteFile(
        filepath.Join(customDir, "custom.css"),
        []byte(req.CssContent),
        0644,
    ); err != nil {
        apiReturn.Error(c, err)
        return
    }

    apiReturn.Success(c)
}
```

---

# 8. 多账号

## 8.1 已确认 API

```http
POST /panel/users/create
POST /panel/users/update
POST /panel/users/getList
POST /panel/users/deletes
GET  /panel/users/getPublicVisitUser
POST /panel/users/setPublicVisitUser
```

后端：

```text
UsersApi.Create
UsersApi.Update
UsersApi.Deletes
UsersApi.GetList
UsersApi.SetPublicVisitUser
UsersApi.GetPublicVisitUser
```

## 8.2 User Model

DWARF 明确恢复：

```text
sun-panel/models.User
```

字段：

```text
BaseModel
Username
Password
Name
HeadImage
Status
Role
Mail
ReferralCode
Token
UserId
```

密码流程中明确调用：

```text
sun-panel/lib/cmn.PasswordEncryption
```

并调用：

```text
(*User).CheckUsernameExist
gorm.(*DB).Create
gorm.(*DB).First
gorm.(*DB).Where
gorm.(*DB).Count
```

因此不要修改密码体系。

---

# 9. 多账号限制解除的正确实现

原前端明确存在：

```js
if (isExpired && userCount >= 2) {
    warning(...)
    return
}
```

目标：

```text
PRO:
    unlimited

Fork:
    unlimited
```

因此自己的前端直接改成：

```js
function addUser() {
    openUserDialog()
}
```

不要保留：

```js
if (isExpired && users.length >= 2)
```

后端也不要保留：

```go
if proAuth.ProIsExpired() && count >= 2 {
    return ErrorNoPro
}
```

但保留系统安全约束：

```text
至少保留一个可登录管理员
```

ELF 中存在：

```text
ErrUsersApiAtLeastKeepOne
```

所以删除逻辑必须继续保护最后一个用户。

---

# 10. 多账号快速切换

前端存在：

```text
accountManager
accounts
```

以及：

```text
/panel/users/getPublicVisitUser
/panel/users/setPublicVisitUser
```

同时前端存在：

```text
isExpired
accountSwitcher
```

限制逻辑。

目标：

```text
accountManager
     │
     ├── accounts[]
     ├── username
     ├── name
     ├── token
     └── switch()
```

建议新建：

```text
src/store/accountManager.ts
```

结构：

```ts
interface SavedAccount {
    userId?: number
    username: string
    name: string
    token: string
}
```

切换：

```text
选择账号
   ↓
token 更新
   ↓
刷新用户信息
   ↓
刷新面板配置
   ↓
刷新项目 / 分组
```

---

# 11. 自定义搜索引擎

前端默认配置已经可以直接确认：

```js
const defaultSearchEngines = [
    {
        iconSrc: "/static/images/builtin/search_engine_icon/google.svg",
        title: "Google",
        url: "https://www.google.com/search?q=",
        key: "google",
        isDefault: true,
        sort: 0
    },
    {
        iconSrc: "/static/images/builtin/search_engine_icon/bing.svg",
        title: "Bing",
        url: "https://www.bing.com/search?q=",
        key: "bing",
        isDefault: true,
        sort: 1
    }
]
```

前端配置对象：

```text
currentSearchEngine
searchEngineList
newWindowOpen
```

保存位置：

```text
deskModuleSearchBox
```

前端明确存在：

```js
if (isExpired && searchEngineList.length >= 4) {
    warning(...)
    return
}
```

也就是说：

```text
默认 Google
默认 Bing
+
免费最多 2 个自定义
=
4 个总数量
```

Fork 应修改为：

```text
searchEngineList.length >= 4
```

不再限制。

更稳妥：

```js
function canAddSearchEngine() {
    return true
}
```

或者统一走：

```js
featureStore.enabled("custom_search")
```

---

# 12. 搜索引擎数据结构

建议：

```ts
interface SearchEngine {
    iconSrc: string
    title: string
    url: string
    key: string
    isDefault: boolean
    sort: number
}
```

持久化：

```text
UserConfig
├── UserId
├── PanelJson
├── Panel
├── SearchEngineJson
└── SearchEngine
```

DWARF 明确恢复：

```text
sun-panel/models.UserConfig
size = 56
```

字段：

```text
UserId
PanelJson
Panel
SearchEngineJson
SearchEngine
```

因此搜索引擎本质上已经是**用户级配置**。

---

# 13. 登录图形验证码

## 13.1 已确认后端

```text
sun-panel/api/api_v1/system.(*CaptchaApi).GetImage
sun-panel/api/api_v1/system.(*CaptchaApi).GetImageByCaptchaId
sun-panel/lib/captcha.GenerateCaptchaHandler
sun-panel/lib/captcha.CaptchaGetIdByCookieHeader
sun-panel/biz.(*CaptchaType).CaptchaVerifyHandle
```

依赖：

```text
github.com/mojocn/base64Captcha v1.3.5
```

前端：

```text
src="/api/captcha/getImage"
```

设置字段：

```text
isEnableLoginCaptcha
```

---

# 14. 验证码实现

推荐保留接口：

```http
GET /api/captcha/getImage
GET /api/captcha/getImageByCaptchaId
```

登录请求增加：

```json
{
    "username": "...",
    "password": "...",
    "vcode": "..."
}
```

流程：

```text
登录页
  ↓
GET /api/captcha/getImage
  ↓
生成 captchaId
  ↓
Cookie / Store 保存 captchaId
  ↓
返回图片
  ↓
用户输入验证码
  ↓
POST /api/login
  ↓
CaptchaVerifyHandle
  ↓
验证码正确
  ↓
用户名密码验证
```

注意：

```text
验证码错误
    ↓
不得进入密码验证成功流程
```

验证码必须有：

```text
TTL
一次性消费
失败次数限制
Session/Cookie 绑定
```

---

# 15. Docker 管理

## 15.1 已确认后端

```text
sun-panel/api/api_v1/docker.(*Container).GetList
sun-panel/api/api_v1/docker.(*Container).RestartContainer
sun-panel/api/api_v1/docker.(*Container).GetContainerStatus
sun-panel/api/api_v1/docker.(*Container).GetContainerState
sun-panel/api/api_v1/docker.(*Container).GetContainerStates
sun-panel/api/api_v1/docker.(*Container).GetContainersState
sun-panel/api/api_v1/docker.(*Container).ExecSwitchActionByContainerID
sun-panel/api/api_v1/docker.(*Container).GetContainerIDByName
```

底层：

```text
sun-panel/lib/docker.NewDockerClient
sun-panel/lib/docker.NewClient
sun-panel/lib/docker.Client.ListAllContainers
sun-panel/lib/docker.Client.GetContainerByName
```

依赖：

```text
github.com/docker/docker v25.0.6
github.com/docker/go-connections v0.5.0
github.com/docker/go-units v0.5.0
```

---

# 16. Docker API

前端已经确认：

```http
GET  /docker/container/getList

POST /docker/container/execSwitchActionByContainerID

POST /docker/container/restartContainer

POST /docker/container/getContainerStates

POST /docker/container/getContainerIDByName
```

建议后端结构：

```text
service/
├── lib/docker/docker.go
├── api/api_v1/docker/container.go
└── router/docker/container.go
```

Docker Client：

```go
type DockerClient struct {
    Client *client.Client
}
```

初始化：

```go
func NewClient() (*DockerClient, error) {
    cli, err := client.NewClientWithOpts(
        client.FromEnv,
        client.WithAPIVersionNegotiation(),
    )
    if err != nil {
        return nil, err
    }

    return &DockerClient{Client: cli}, nil
}
```

---

# 17. Docker 安全要求

Docker 属于高权限功能。

不要简单允许前端传入任意 Docker API。

必须限制：

```text
容器 ID / Name
操作类型
```

允许：

```text
start
stop
restart
```

不建议默认开放：

```text
exec arbitrary command
```

如果必须保留 Exec：

```text
AdminInterceptor
+
容器白名单
+
命令白名单
```

---

# 18. 公共图库

## 18.1 后端 API

```http
GET/POST /panel/publicGallery/getImagesList
POST     /api/panel/publicGallery/uploadImg
POST     /panel/publicGallery/deletes
POST     /panel/publicGallery/updateFileType
```

后端：

```text
PublicGalleryApi.GetImagesList
PublicGalleryApi.UploadImg
PublicGalleryApi.Deletes
PublicGalleryApi.UpdateFileType
```

---

# 19. 公共图库核心 Model

DWARF 恢复：

```text
sun-panel/models.File
size = 216
```

字段：

```text
BaseModel
Src
UserId
FileName
Type
Ext
IsPublicGallery
```

这是实现公共图库最关键的证据。

普通图库：

```text
UserId = 当前用户
IsPublicGallery = false
```

公共图库：

```text
IsPublicGallery = true
```

因此公共图库不需要新增一套图片表。

---

# 20. 公共图库推荐实现

查询：

```go
db.Where("is_public_gallery = ?", true)
```

用户私有图库：

```go
db.Where("user_id = ?", currentUserID)
```

管理员：

```text
可以管理公共图库
```

普通用户：

```text
可以读取公共图库
```

删除：

```text
Admin only
```

---

# 21. 上传接口

前端已经确认：

```text
/api/panel/publicGallery/uploadImg
```

上传组件使用：

```text
token
fileType
```

文件类型至少区分：

```text
wallpaper
icon
```

推荐：

```go
type FileType int

const (
    FileTypeWallpaper FileType = 1
    FileTypeIcon      FileType = 2
)
```

---

# 22. 备份 / 迁移

## 22.1 API

```http
GET  /panel/backup/backup

POST /panel/backup/recovery

POST /api/panel/backup/uploadZipFile

GET  /api/panel/backup/downloadBackupZIPFile
```

DTO：

```go
type RecoveryReq struct {
    FileName string `json:"fileName"`
    Force    bool   `json:"force"`
}
```

恢复响应：

```go
type RecoveryResp struct {
    CompatibilityStatus    int    `json:"compatibilityStatus"`
    LowestSunPanelVersion  string `json:"lowestSunPanelVersion"`
}
```

---

# 23. BackupConfig

DWARF 明确恢复：

```text
sun-panel/biz.BackupConfig
size = 128
```

字段：

```text
Name
ConfigVersion
SunPanelVersion
SunPanelLowestVersion
Time
Paths
```

路径对象：

```text
BackupConfigPath
├── Uploads
├── CustomStyle
└── Sqlite
```

这非常关键，因为说明备份并不只是数据库。

---

# 24. 备份结构

推荐输出：

```text
sun-panel-backup-YYYYMMDD-HHMMSS.zip
│
├── config/
│   └── backup.json
│
├── uploads/
│   ├── wallpaper/
│   └── icon/
│
├── custom/
│   ├── custom.js
│   └── custom.css
│
└── database/
    └── sun-panel.db
```

其中实际目录名称必须以你目标源码树的配置为准。

---

# 25. 备份核心函数

二进制中明确存在：

```text
BackupType.buildConfig
BackupType.backupToTemp
BackupType.backupPathToZip
BackupType.BackupToZip
BackupType.saveBackupConfig
BackupType.loadBackupConfig
BackupType.ExtractBackZip
BackupType.ExtractBackupZipAndLoadConfig
BackupType.Recovery
BackupType.deleteSqliteDatabaseImportantData
BackupType.VersionCompatibilityCheck
```

所以建议按相同职责拆分：

```text
BackupToZip()
    ↓
buildConfig()
    ↓
backupToTemp()
    ↓
backupPathToZip()
    ↓
saveBackupConfig()
```

恢复：

```text
ExtractBackZip()
    ↓
ExtractBackupZipAndLoadConfig()
    ↓
VersionCompatibilityCheck()
    ↓
Recovery()
```

---

# 26. 恢复流程

```text
上传 ZIP
   ↓
校验 ZIP
   ↓
读取 backup.json
   ↓
读取 SunPanelVersion
   ↓
VersionCompatibilityCheck
   ↓
不兼容？
   ├─ YES → 返回兼容性结果
   └─ NO
       ↓
停止写入
       ↓
备份当前数据库
       ↓
恢复 SQLite
       ↓
恢复 uploads
       ↓
恢复 custom JS/CSS
       ↓
恢复配置
       ↓
清理缓存
       ↓
重新加载 SystemSetting
       ↓
返回成功
```

---

# 27. 为什么不能只删除 ProAuth

不能做：

```text
删除 proAuth.go
```

然后认为所有 PRO 功能就可以工作。

因为：

```text
ProAuth
```

同时参与：

```text
前端状态
后端限制
错误码
路由
公开模式
用户数量限制
搜索引擎数量限制
上传限制
UI badge
```

例如 ELF 中明确出现：

```text
apiReturn.ErrorNoAccess
ErrorCode = 1008
"No PRO authorization"
```

因此应当把：

```text
ProAuth
```

从业务功能中剥离，而不是暴力删除整个模块。

---

# 28. 授权依赖改造

## 28.1 原逻辑

```go
if ProAuth.ProIsExpired() {
    return apiReturn.ErrorByCode(..., 1008)
}
```

## 28.2 新逻辑

```go
if !feature.Enabled(FeatureBackupMigration) {
    return apiReturn.ErrorNoAccess(c)
}
```

默认：

```go
FeatureBackupMigration = true
```

这样：

```text
原 PRO
    ↓
Feature Gate
    ↓
自己的配置
```

---

# 29. PRO UI Badge 改造

前端目前：

```text
proAuthorize.isExpired
proAuthorize.hideProBadge
```

建议：

```text
proAuthorize
```

替换为：

```text
featureStore
```

例如：

```ts
const featureStore = defineStore("features", () => ({
    customCode: true,
    multiUser: true,
    branding: true,
    docker: true,
    customSearch: true,
    captcha: true,
    accountSwitcher: true,
    publicGallery: true,
    backupMigration: true,
}))
```

然后：

```vue
<ProBadge v-if="!featureStore.customSearch" />
```

改成：

```vue
<ProBadge v-if="false" />
```

或者直接删除 PRO Badge。

---

# 30. 前端模块依赖闭包

## 30.1 公共运行时

不要复制：

```text
index-CZz6aXaE.js
```

到某个页面目录后就结束。

它是大型公共 chunk。

依赖关系：

```text
index-CZz6aXaE.js
├── Vue runtime
├── Pinia
├── UI components
├── API client
├── i18n
├── common components
├── stores
├── router
└── 多个 lazy chunk
```

---

# 31. 已确认的前端 chunk

```text
Custom CSS / JS
    ↓
index-BGbQJZJY.js

Users
    ↓
index-B3_LCu7X.js

Branding / GlobalSetting
    ↓
index-BGbQJZJY.js

Docker
    ↓
index-39mBaDH5.js
index-CZz6aXaE.js

Search Engine
    ↓
index-CZz6aXaE.js
index-CAKlOUqX.js

Captcha
    ↓
index-DZxLZB07.js

Public Gallery
    ↓
index-TZ20XPVQ.js

Backup / Migration
    ↓
index-xBob14gZ.js
```

---

# 32. 前端依赖处理规则

执行：

```text
页面 chunk
 ↓
import()
 ↓
import dependency
 ↓
公共组件
 ↓
store
 ↓
API client
 ↓
i18n
```

最终不要形成：

```text
复制整个 dist
```

而应该回到：

```text
src/apps/
src/components/
src/stores/
src/api/
src/locales/
```

重新建立源码结构。

---

# 33. 推荐源码目录

如果目标是 Sun-Panel 原有源码结构，建议：

```text
src/
├── api/
│   ├── globalSetting.ts
│   ├── users.ts
│   ├── publicGallery.ts
│   ├── backup.ts
│   └── docker.ts
│
├── apps/
│   ├── GlobalSetting/
│   ├── Users/
│   ├── Docker/
│   ├── PublicGallery/
│   └── BackupMigration/
│
├── components/
│   ├── Gallery/
│   ├── Captcha/
│   └── AccountSwitcher/
│
└── stores/
    ├── features.ts
    └── accountManager.ts
```

后端：

```text
service/
├── api/api_v1/
│   ├── docker/
│   ├── panel/
│   │   ├── globalSetting.go
│   │   ├── users.go
│   │   ├── publicGallery.go
│   │   └── backup.go
│   └── system/
│       ├── captcha.go
│       └── login.go
│
├── biz/
│   ├── backup.go
│   ├── captcha.go
│   ├── docker.go
│   ├── globalSetting.go
│   ├── users.go
│   └── feature.go
│
├── lib/
│   ├── captcha/
│   ├── docker/
│   └── file/
│
├── models/
│   ├── SystemSetting.go
│   ├── User.go
│   └── file.go
│
└── router/
    ├── docker/
    ├── panel/
    └── system/
```

---

# 34. 路由重建清单

## GlobalSetting

```text
/panel/globalSetting/getSiteStting
/panel/globalSetting/saveSiteStting
/panel/globalSetting/getCustomStylePath
/panel/globalSetting/getCustomJsAndCssCode
/panel/globalSetting/saveCustomJsAndCssCode
/api/panel/globalSetting/uploadFaviconImage
```

## Users

```text
/panel/users/create
/panel/users/update
/panel/users/getList
/panel/users/deletes
/panel/users/getPublicVisitUser
/panel/users/setPublicVisitUser
```

## Public Gallery

```text
/panel/publicGallery/getImagesList
/api/panel/publicGallery/uploadImg
/panel/publicGallery/deletes
/panel/publicGallery/updateFileType
```

## Backup

```text
/panel/backup/backup
/panel/backup/recovery
/api/panel/backup/uploadZipFile
/api/panel/backup/downloadBackupZIPFile
```

## Captcha

```text
/api/captcha/getImage
/panel/captcha/getImageByCaptchaId
```

## Docker

```text
/docker/container/getList
/docker/container/execSwitchActionByContainerID
/docker/container/restartContainer
/docker/container/getContainerStates
/docker/container/getContainerIDByName
```

---

# 35. Middleware

发布包中存在：

```text
sun-panel/api/api_v1/middleware/AdminInterceptor
sun-panel/api/api_v1/middleware/LoginInterceptor
sun-panel/api/api_v1/middleware/PublicModeInterceptor
```

因此不能因为移除 PRO 授权就删除这些 middleware。

建议权限模型：

```text
LoginInterceptor
    ↓
必须登录

AdminInterceptor
    ↓
必须管理员

PublicModeInterceptor
    ↓
公开访问限制
```

与：

```text
FeatureEnabled
```

分开。

---

# 36. 推荐最终权限矩阵

| 功能 | 未登录 | 普通用户 | 管理员 |
|---|---:|---:|---:|
| CSS/JS 修改 | ❌ | ❌ | ✅ |
| 品牌设置 | ❌ | ❌ | ✅ |
| 用户管理 | ❌ | ❌ | ✅ |
| 快速切换 | 登录后 | ✅ | ✅ |
| 自定义搜索引擎 | 登录后 | ✅ | ✅ |
| Docker | 登录后 | 按原权限 | ✅ |
| 验证码 | 登录流程 | — | — |
| 公共图库读取 | 可按公开策略 | ✅ | ✅ |
| 公共图库管理 | ❌ | ❌ | ✅ |
| 备份 | ❌ | ❌ | ✅ |
| 恢复 | ❌ | ❌ | ✅ |

---

# 37. 品牌设置

前端已经确认：

```text
title
favicoUrl
loginBackgroundUrl
isEnableLoginCaptcha
```

建议最终设置：

```text
站点标题
站点 ICO
登录页背景
登录页文字
登录验证码开关
```

登录页文字如果原 v1.8.1 没有独立后端字段，不要凭空新增为同名字段。

推荐扩展：

```text
site_login_title
site_login_subtitle
site_login_description
```

但这是**新设计字段**，不是从二进制确认得到的原字段。

---

# 38. Favicon

已确认：

```text
GlobalSettingApi.UploadFaviconImage
ItemIcon.GetSiteFavicon
ItemIcon.GetSiteFaviconList
ItemIcon.DownloadFavicon
```

站点图标不要直接覆盖系统默认：

```text
web/favicon.ico
```

推荐：

```text
conf/custom/favicon.ico
```

访问：

```text
/panel/itemIcon/getSiteFavicon
```

或者由 Web 层映射：

```text
/favicon.ico
```

---

# 39. Docker 状态模型

前端明确使用：

```text
created
restarting
removing
running
paused
exited
dead
error
```

Docker API 应统一返回：

```json
{
    "id": "...",
    "name": "...",
    "state": "running",
    "status": "...",
    "ports": {}
}
```

状态刷新：

```text
getContainerStates
```

采用：

```text
containerIds[]
ts
```

前端有定时刷新资源状态的逻辑。

---

# 40. Docker 与项目卡片

前端存在：

```text
containerId
containerName
openPageAndStart
openPageAndStartDelaySecond
cardType
showBadgeStatus
```

因此 Docker 功能不仅是“Docker 管理页面”。

还存在：

```text
普通项目卡
    ↓
Docker 项目卡
    ↓
containerId
    ↓
start/stop/restart
```

迁移时必须同时恢复：

```text
Item
Item.expandParam
Docker card type
containerId
containerName
```

---

# 41. 公共图库与 File Model 的关系

最终数据流：

```text
Upload
  ↓
File
  ├── Src
  ├── FileName
  ├── UserId
  ├── Type
  ├── Ext
  └── IsPublicGallery
             │
             ├── false → 私有图库
             └── true  → 公共图库
```

因此不需要建立：

```text
PublicGalleryImage
```

新表。

---

# 42. 搜索引擎与 UserConfig 的关系

最终：

```text
User
  │
  └── UserConfig
        │
        ├── PanelJson
        ├── Panel
        ├── SearchEngineJson
        └── SearchEngine
```

所以多账号与搜索引擎必须一起测试。

测试：

```text
Admin
 ├── Google
 ├── Bing
 ├── GitHub
 └── 自定义 N 个
       ↓
切换普通用户
       ↓
搜索引擎列表保持独立
```

---

# 43. 备份必须覆盖 PRO 新增数据

备份至少覆盖：

```text
SQLite
uploads
custom JS
custom CSS
favicon
login background
用户数据
用户配置
搜索引擎配置
公共图库标记
Docker 项目卡配置
```

恢复后：

```text
数据库
+
文件系统
+
自定义代码
+
品牌
```

必须一致。

---

# 44. 迁移时最容易漏掉的东西

## 漏项 1：前端 lazy chunk

只复制：

```text
index-TZ20XPVQ.js
```

可能运行失败。

必须检查：

```text
import("./index-CZz6aXaE.js")
```

及其所有依赖。

---

## 漏项 2：i18n

已发现：

```text
publicGallery
backupMigration
proAuth
searchBox
dockerManage
```

相关中文/英文文案。

迁移时必须把：

```text
zh-CN
en-US
```

对应 key 一起迁移。

---

## 漏项 3：错误码

至少关注：

```text
1005
1008
1201
1202
1300
1301
1400
```

以及：

```text
ErrorNoAccess
ErrorNoPro
ErrUsersApiAtLeastKeepOne
```

建议重新整理成：

```go
const (
    ErrNotLogin       = 1000
    ErrNoPermission   = 1005
    ErrNoPro          = 1008 // 兼容旧客户端时保留；新代码不再使用
    ErrKeepOneUser    = 1201
)
```

如果完全脱离 PRO，可以停止产生 `1008`。

---

# 45. 建议的数据库迁移策略

不要直接修改旧 SQLite 表结构。

第一阶段：

```text
保持原表
```

第二阶段：

```text
增加索引
```

第三阶段：

```text
Feature flags 使用 SystemSetting
```

例如：

```text
ConfigName:
feature.custom_code
feature.multi_user
feature.branding
feature.docker
feature.custom_search
feature.captcha
feature.account_switcher
feature.public_gallery
feature.backup_migration
```

ConfigValue：

```text
true
```

这样可以做到：

```text
不需要重新编译
即可关闭某个功能
```

---

# 46. 推荐默认配置

```ini
[feature]
custom_code=true
multi_user=true
branding=true
docker=true
custom_search=true
captcha=true
account_switcher=true
public_gallery=true
backup_migration=true
```

如果项目已经使用：

```text
conf/conf.ini
```

可以直接扩展。

如果不想修改 ini：

```text
SystemSetting
```

也是可行方案。

---

# 47. PRO Auth 模块处理方案

不要直接删除：

```text
service/biz/proAuth.go
service/lib/proAuth/
service/router/panel/proAuth.go
```

第一阶段保留兼容层：

```go
type ProAuthCompat struct{}

func (p *ProAuthCompat) IsExpired() bool {
    return false
}
```

然后逐步把业务调用改为：

```go
feature.Enabled(...)
```

最后：

```text
业务代码
    ↓
FeatureService

旧 ProAuth
    ↓
仅兼容接口
```

确认没有引用后再删除。

---

# 48. 需要重点搜索的原 PRO 引用

在自己的源码树执行：

```bash
grep -RIn \
  -E 'ProAuth|ProIsExpired|isExpired|noProAuth|No PRO authorization|1008' \
  service src
```

再：

```bash
grep -RIn \
  -E 'proAuthorize|hideProBadge|proAuth' \
  src
```

最终目标：

```text
业务功能中：
ProAuth 引用 = 0

兼容层中：
ProAuth 引用 = 可选
```

---

# 49. 第二轮逆向建议

因为 v1.8.1 ELF 保留 DWARF，可以继续做：

```bash
go tool nm sun-panel

go tool objdump \
    -s 'sun-panel/biz.*BackupType.*' \
    sun-panel

readelf --debug-dump=info sun-panel

readelf --debug-dump=decodedline sun-panel
```

重点恢复：

```text
函数
参数
返回值
源码路径
源码行号
结构体
字段
字符串
接口
```

---

# 50. 反编译工具链

推荐：

```text
Go toolchain
├── go tool nm
├── go tool objdump
└── go tool addr2line

ELF
├── readelf
├── objdump
└── strings

GUI
└── Ghidra / IDA
```

不要只使用：

```text
strings
```

因为 strings 只能证明：

```text
字符串存在
```

不能证明：

```text
字符串在哪里使用
```

---

# 51. Go 函数恢复优先级

第一优先级：

```text
GlobalSettingApi
UsersApi
PublicGalleryApi
BackupApi
CaptchaApi
```

第二优先级：

```text
router/*
middleware/*
models/*
lib/*
```

第三优先级：

```text
ProAuth
```

原因：

```text
PRO 功能本身
```

比：

```text
PRO 商业授权服务
```

更重要。

---

# 52. 后端实现顺序

必须按下面顺序：

```text
① Models
       ↓
② Biz
       ↓
③ API
       ↓
④ Router
       ↓
⑤ Middleware
       ↓
⑥ Frontend API
       ↓
⑦ Frontend Page
       ↓
⑧ Feature Store
       ↓
⑨ Build
```

不要先做 UI。

---

# 53. 前端实现顺序

```text
GlobalSetting
      ↓
Users
      ↓
AccountSwitcher
      ↓
SearchEngine
      ↓
Captcha
      ↓
PublicGallery
      ↓
Docker
      ↓
BackupMigration
```

---

# 54. 第一阶段：CSS / JS

验收：

```text
GET API 正常
POST API 正常
custom.js 可读取
custom.css 可读取
刷新页面保持
重启 Sun-Panel 保持
备份包含
恢复后保持
```

---

# 55. 第二阶段：用户

验收：

```text
创建用户
修改用户
删除用户
密码登录
角色权限
用户配置隔离
无限数量
最后一个用户不能删除
```

---

# 56. 第三阶段：搜索引擎

验收：

```text
Google
Bing
自定义 1
自定义 2
自定义 10
自定义 50
自定义 100
```

并测试：

```text
排序
图标
当前搜索引擎
新窗口
关键词替换
```

---

# 57. 第四阶段：公共图库

验收：

```text
管理员上传
管理员删除
管理员修改类型
普通用户读取
不同账号读取一致
图片 URL 有效
重启后有效
备份后存在
恢复后存在
```

---

# 58. 第五阶段：Docker

验收：

```text
读取容器
运行状态
CPU
RAM
端口
启动
停止
重启
异常容器
容器 ID 修复
```

Docker 不可用时：

```text
页面不能白屏
```

必须显示：

```text
Docker daemon unavailable
```

---

# 59. 第六阶段：验证码

验收：

```text
开启验证码
关闭验证码
刷新验证码
验证码错误
验证码正确
验证码过期
验证码重复提交
Cookie 丢失
密码错误
```

---

# 60. 第七阶段：备份迁移

验收：

```text
创建备份
下载备份
上传备份
读取版本
版本兼容检查
恢复数据库
恢复图片
恢复 CSS
恢复 JS
恢复品牌
恢复用户
恢复搜索引擎
```

---

# 61. 全量回归测试

建立：

```text
tests/pro-features/
```

至少：

```text
global_setting_test.go
users_test.go
captcha_test.go
public_gallery_test.go
backup_test.go
docker_test.go
```

前端：

```text
tests/e2e/
├── users.spec.ts
├── search.spec.ts
├── gallery.spec.ts
├── docker.spec.ts
├── backup.spec.ts
└── branding.spec.ts
```

---

# 62. Docker 构建测试

```bash
docker build -t sun-panel-pro-open .
```

启动：

```bash
docker run -d \
  --name sun-panel-test \
  -p 3002:3002 \
  -v ./conf:/app/conf \
  sun-panel-pro-open
```

如果需要 Docker 管理：

```bash
-v /var/run/docker.sock:/var/run/docker.sock
```

---

# 63. Linux amd64 构建

```bash
CGO_ENABLED=1 \
GOOS=linux \
GOARCH=amd64 \
go build \
  -o sun-panel \
  ./service
```

如果目标项目使用：

```text
main.go
```

则按现有项目 build.sh 的入口调整。

---

# 64. ARM64 构建

如果最终部署 NAS / ARM：

```bash
CGO_ENABLED=1 \
GOOS=linux \
GOARCH=arm64 \
go build \
  -o sun-panel \
  ./service
```

Docker：

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t your-registry/sun-panel:custom \
  --push .
```

---

# 65. 文件安全

CSS / JS 是管理员输入。

不能允许：

```text
../../
../../../
/etc/passwd
```

必须：

```go
func safeCustomPath(base, name string) (string, error) {
    p := filepath.Clean(filepath.Join(base, name))

    baseAbs, _ := filepath.Abs(base)
    pathAbs, _ := filepath.Abs(p)

    if !strings.HasPrefix(
        pathAbs,
        baseAbs+string(os.PathSeparator),
    ) {
        return "", errors.New("invalid path")
    }

    return pathAbs, nil
}
```

---

# 66. ZIP 安全

恢复 ZIP 必须防：

```text
Zip Slip
绝对路径
软链接逃逸
超大压缩包
磁盘耗尽
恶意 SQLite
```

禁止：

```text
../../../etc/passwd
/etc/passwd
```

恢复目录必须固定在：

```text
temp/backup/
```

---

# 67. Docker 安全

必须：

```text
AdminInterceptor
```

并限制：

```text
container ID
action
exec
```

不能把：

```text
docker.sock
```

暴露给浏览器。

正确架构：

```text
Browser
  ↓
Sun-Panel API
  ↓
Docker SDK
  ↓
Docker daemon
```

而不是：

```text
Browser
  ↓
docker.sock
```

---

# 68. PRO 依赖清理完成标准

执行：

```bash
grep -RIn 'ProAuth' service src
grep -RIn 'ProIsExpired' service src
grep -RIn 'isExpired' src
grep -RIn '1008' service src
```

最终：

```text
业务功能：
0 个 PRO 授权依赖

Feature Service：
9 个功能开关

ProAuth：
删除 / 兼容层
```

---

# 69. 最终架构

```text
                 ┌──────────────────────┐
                 │       Sun-Panel      │
                 └──────────┬───────────┘
                            │
                 ┌──────────▼───────────┐
                 │    FeatureService    │
                 └──────────┬───────────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
 GlobalSetting           Users                Docker
       │                    │                    │
       ▼                    ▼                    ▼
 CSS/JS                  MultiUser          Docker SDK

       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
 SearchEngine           Captcha            PublicGallery
       │                    │                    │
       ▼                    ▼                    ▼
 UserConfig             Login               File Model

                            │
                            ▼
                       BackupMigration
                            │
                            ▼
                  SQLite + uploads + custom
```

---

# 70. 实际改造任务清单

## P0：建立基础

```text
[ ] 确认自己的 Fork 当前版本
[ ] 建立 service/biz/feature.go
[ ] 建立 feature 配置
[ ] 建立统一 FeatureService
[ ] 删除前端 proAuthorize 对业务功能的依赖
```

## P1：核心 PRO

```text
[ ] CSS/JS
[ ] Branding
[ ] Multi User
[ ] Account Switcher
[ ] Search Engine
```

## P2：系统能力

```text
[ ] Captcha
[ ] Public Gallery
[ ] Docker
```

## P3：数据能力

```text
[ ] Backup
[ ] Recovery
[ ] Version Compatibility
```

## P4：清理

```text
[ ] 移除 PRO Badge
[ ] 移除 PRO 数量限制
[ ] 移除 ErrorCode 1008 业务分支
[ ] 移除 proAuth 前端 store
[ ] 删除无引用 proAuth 后端
[ ] gofmt
[ ] go test
[ ] npm/pnpm build
[ ] Docker build
```

---

# 71. Codex / AI Agent 执行提示词

把以下要求交给代码智能体执行：

```text
你正在修改一个 Sun-Panel Fork。

目标：
把 Sun-Panel v1.8.1 发布包中已经确认存在的 PRO 功能，
重新实现到当前源码树中。

功能：
1. 在线修改自定义 CSS、JS
2. 多账号无限制
3. 自定义站点图标、标题、登录页品牌信息
4. Docker 应用管理
5. 自定义搜索引擎无限制
6. 登录图形验证码
7. 多账号快速切换
8. 公共图库
9. 备份、迁移

重要：
不要修改 ELF。
不要通过 patch 二进制绕过授权。
不要删除功能实现。
把 PRO 授权依赖替换为本地 FeatureService。

必须先扫描：
service/
src/
config/
router/
models/
api/
store/

然后建立：
FeatureService
feature configuration
frontend feature store

所有原：
ProAuth
ProIsExpired
isExpired
1008
noProAuth
PRO limit

必须分类处理：

A. 真正的功能逻辑：
保留 / 重建

B. 商业授权逻辑：
迁移到 FeatureService

C. PRO Badge / UI：
删除或改成普通功能

D. 安全权限：
必须保留 AdminInterceptor / LoginInterceptor

先做后端：
Model → Biz → API → Router

再做前端：
API → Store → Page → i18n

每完成一个功能：
1. gofmt
2. go test
3. 前端 typecheck
4. 前端 build

不要一次性大范围重构。

每次提交只完成一个 PRO 功能。

最终输出：
PRO_MIGRATION_IMPLEMENTATION_REPORT.md
包括：
- 修改文件
- 新增文件
- API
- DB
- Feature Gate
- 测试
- 编译结果
- 未完成事项
```

---

# 72. 推荐实际实施顺序

最终不要按“页面顺序”做。

建议：

```text
阶段 1
FeatureService
    ↓
GlobalSetting
    ↓
CSS/JS
    ↓
Branding

阶段 2
Users
    ↓
AccountSwitcher
    ↓
UserConfig

阶段 3
SearchEngine
    ↓
Captcha

阶段 4
File
    ↓
PublicGallery

阶段 5
Docker

阶段 6
Backup
    ↓
Recovery

阶段 7
PRO Auth 清理
```

---

# 73. 本次 v1.8.1 二进制分析的关键证据

## ELF / Go

```text
Go 1.23.2
linux/amd64
not stripped
DWARF present
```

## Models

```text
sun-panel/models.User
sun-panel/models.SystemSetting
sun-panel/models.File
sun-panel/models.UserConfig
sun-panel/models.ItemIcon
sun-panel/models.ItemIconGroup
```

## PRO

```text
sun-panel/biz.ProAuthType
sun-panel/biz.(*ProAuthType).ProIsExpired
sun-panel/biz.NewProAuth
```

## GlobalSetting

```text
sun-panel/api/api_v1/panel.(*GlobalSettingApi).SaveSiteStting
sun-panel/api/api_v1/panel.(*GlobalSettingApi).GetSiteStting
sun-panel/api/api_v1/panel.(*GlobalSettingApi).UploadFaviconImage
sun-panel/api/api_v1/panel.(*GlobalSettingApi).GetCustomStylePath
sun-panel/api/api_v1/panel.(*GlobalSettingApi).GetCustomJsAndCssCode
sun-panel/api/api_v1/panel.(*GlobalSettingApi).SaveCustomJsAndCssCode
```

## Users

```text
sun-panel/api/api_v1/panel.UsersApi.Create
sun-panel/api/api_v1/panel.UsersApi.Update
sun-panel/api/api_v1/panel.UsersApi.Deletes
sun-panel/api/api_v1/panel.UsersApi.GetList
sun-panel/api/api_v1/panel.UsersApi.SetPublicVisitUser
sun-panel/api/api_v1/panel.UsersApi.GetPublicVisitUser
```

## Gallery

```text
sun-panel/api/api_v1/panel.(*PublicGalleryApi).GetImagesList
sun-panel/api/api_v1/panel.(*PublicGalleryApi).UploadImg
sun-panel/api/api_v1/panel.(*PublicGalleryApi).Deletes
sun-panel/api/api_v1/panel.(*PublicGalleryApi).UpdateFileType
```

## Backup

```text
sun-panel/biz.(*BackupType).BackupToZip
sun-panel/biz.(*BackupType).Recovery
sun-panel/biz.(*BackupType).VersionCompatibilityCheck
```

## Captcha

```text
sun-panel/api/api_v1/system.(*CaptchaApi).GetImage
sun-panel/api/api_v1/system.(*CaptchaApi).GetImageByCaptchaId
sun-panel/biz.(*CaptchaType).CaptchaVerifyHandle
```

## Docker

```text
sun-panel/api/api_v1/docker.(*Container).GetList
sun-panel/api/api_v1/docker.(*Container).RestartContainer
sun-panel/api/api_v1/docker.(*Container).ExecSwitchActionByContainerID
```

---

# 74. 最终判断

本项目不是“没有 PRO 源码，只能自己猜”。

v1.8.1 发布包实际提供了非常丰富的逆向依据：

```text
源码路径
+
函数名
+
源码行号
+
Go 类型
+
结构体字段
+
API endpoint
+
前端业务代码
+
错误码
+
第三方依赖
```

因此可以达到：

```text
功能行为级重建
        ████████████████████  高

API / Router 重建
        ████████████████████  高

Model / DB 结构重建
        ██████████████████    高

前端页面重建
        ████████████████████  高

Go 业务逻辑等价重建
        ███████████████       中高

恢复原作者逐字 Go 源码
        ███                   低
```

真正应该追求的是：

> **重新实现一个行为等价、结构清晰、可维护、可编译的 Sun-Panel Fork，而不是试图把 ELF 还原成原作者一模一样的 `.go` 文件。**

---

# 75. 下一步执行目标

如果进入实际编码阶段，第一轮不要动全部功能。

直接执行：

```text
V1
├── FeatureService
├── GlobalSetting
│   ├── SiteSetting
│   ├── Favicon
│   └── Custom CSS/JS
├── Multi User
└── Account Switcher
```

完成后：

```bash
go test ./...
pnpm build
docker build .
```

第二轮：

```text
SearchEngine
Captcha
PublicGallery
```

第三轮：

```text
Docker
Backup
Recovery
```

第四轮：

```text
ProAuth 清理
错误码清理
UI Badge 清理
最终回归
```

这样风险最低，也最容易让 Codex / WorkBuddy / Claude Code 等代码智能体逐阶段完成。

---

## 附：本次样本文件

```text
sun-panel_v1.8.1_linux_amd64.tar.gz
```

重点分析对象：

```text
sun-panel
web/assets/*.js
web/index.html
```

分析所得前端功能 chunk：

```text
index-BGbQJZJY.js
index-B3_LCu7X.js
index-39mBaDH5.js
index-CZz6aXaE.js
index-CAKlOUqX.js
index-DZxLZB07.js
index-TZ20XPVQ.js
index-xBob14gZ.js
```

