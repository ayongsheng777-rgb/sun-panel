# AGENTS.md — Sun-Panel（AI 增强版）项目指南

> 给 AI 协作者看的项目地图。改代码前先把这份读完。
> 上游：`hslr/sun-panel`；本仓库：`ayongsheng777-rgb/sun-panel`（master 即生产）。

## 1. 这是什么

导航面板（Vue3 + Naive UI 前端 / Go Gin + GORM + SQLite 后端），在上游基础上做了大幅 AI 增强：
AI 搜索、AI 操作代理（对话接管面板）、AI 批量整理、OTP 双因素、安全中心、弹性多网址。

## 2. 目录速查

```
src/                    # 前端（Vue3 + TS + Vite + Naive UI + Tailwind）
  api/ai/index.ts       # AI 统一 API 入口（agent / config / models / test / auto-best）
  utils/request/        # axios 封装：code 1000/1001 → 跳登录；GET 也必须带 token 头（踩过坑）
  views/home/components/AdminPanel/   # 集中管理面板（含 AI 配置内嵌页）
  views/home/components/AISearchConfig/  # AI 配置（provider/key/模型/思考模式/自动优选）
service/                # 后端（Go）
  router/panel/         # 路由注册（AI 接口全在 /api 前缀下，挂 LoginInterceptor）
  api/api_v1/panel/     # handler：search.go(AI搜索/配置/测速/自动优选)、aiAgent.go(对话代理)、aiManage.go
  lib/ai/               # AI 核心
    ai.go               # OpenAI 兼容适配器（全 provider 统一）、thinking 参数映射、TestModel
    config.go           # AIConfig 存取（module_config 表，按用户隔离）
    engine.go           # 意图路由引擎：LLM 选工具 → 权限校验 → 执行（四层删除防线）
    autobest.go         # NVIDIA 自动优选：候选池∩可见列表→并发实测→速度优先→自动存库
    agent.go            # AgentResult / DeleteGuard
    tools/              # 工具注册表（panel/additem/web/settings/organize/batch/overview/category/util/db）
docs/                   # 重构指导书、实施文档、功能变更报告
dist/                   # 前端构建产物（gitignored，本地 vite build 输出）
```

## 3. 关键机制（改动前必读）

- **登录态**：前端所有请求带 `token` 头（GET 也要，漏了会被 1000 踢回登录页——已修，别回退）。
- **AI 配置**：存 `module_config` 表（name='aiSearchConfig'，按 user_id 隔离）；apiKey 只存服务端，前端留空=保留原值。
- **主备切换**：`activeProviders()` 主用失败自动切备用（backupProvider）。
- **删除隔离**：AI 工具注册表拒绝 delete 权限 + DeleteGuard 关键词兜底，删除只能用户手动。
- **批量工具**：内网归组（死规则判定，不靠 LLM）、失效体检（两轮探活、内网跳过）、
  全量重归纳（AI 从零设计分组，白名单=AI设计集∪固定分类∪已存在分组）。

## 4. 构建与部署（ fnOS NAS ）

- **本机无 Go 工具链**：Go 编译只能在 NAS 上 Docker 里跑（golang:1.21-bullseye + gcc，CGO 必需）。
- **前端本地可构建**：`node node_modules/vite/bin/vite.js build`（用托管 node；不要跑 `pnpm build`，
  add-version 步骤写 .env 会被沙箱拦）。构建前 `rm -rf dist`。
- **部署目标**：NAS `192.168.57.228:2525`（网段变过，找不到就 arp 按尾号 .228 找），
  应用目录 `/vol1/@appcenter/Sun-Panel`，端口 **13002**。
- **两种部署路径**：
  - 只改前端 → 快速部署：`D:\WorkBuddy\tmp\sunpanel_web_deploy.py`（传 tar → 清 web/assets → 解压，免重编 Go）；
  - 改了 Go → 全量部署：先 `git push origin master`（走代理 127.0.0.1:1080），
    再跑 `~/.workbuddy/skills/sun-panel-deploy/scripts/ssh_deploy_full.py`（克隆 master 远程全编，约 3.5 分钟）。
- **铁律**：`web/` 是运行目录直读；替换前必须 `rm -rf web/assets`（防陈旧 hash 文件残留）；
  远程构建只认 master 已推送的提交。

## 5. 已知坑（都踩过）

1. GET 请求漏传 token 头 → AI 配置页被踢回登录（2026-08-18 修）。
2. NAS 网段会变（68→57），部署脚本 IP 要跟着更新。
3. NVIDIA 免费 key 对 /models 列表里大半模型调不通——选模型必须实测（auto-best 的由来）。
4. 境外网站从 NAS 直连探活不准，失效体检已按约定跳过内网、境外站报告里提示人工复核。
5. `service/sun-panel` 是 NAS 编出的 Linux 二进制，别提交（已 gitignore）。
6. 推理模型参数各家不同：DeepSeek thinking.type 只认 enabled/disabled/adaptive（映射在 ai.go）。

## 6. 提交习惯

- commit 用中文、写清根因；push 必须走代理：`git -c http.proxy=http://127.0.0.1:1080 push origin master`。
- 部署后必验证：`curl :13002/` 返 200、目标接口未授权返 1000（非 404）、线上 JS 含新代码标记。
