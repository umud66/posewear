<div align="center">

<img src="docs/banner.jpg" alt="人像 + 姿势 + 服饰 = 成品" width="900">

<sub>成品为用站内人像、姿势、服装作参考的 AI 生成示例；素材版权归原作者，见<a href="#致谢">致谢</a>。</sub>

<img src="docs/logo.svg" width="72" alt="衣姿 PoseWear">

# 衣姿 PoseWear

姿势、服装、人像与深度姿势参考图库；保留原版工作台，使用 **Cloudflare Workers AI 免费额度**生成图片，无需第三方 API Key 或模型中转站。

[![License: MIT](https://img.shields.io/badge/license-MIT-black)](LICENSE)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-f38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![在线体验](https://img.shields.io/badge/demo-posewear.pages.dev-ff2442)](https://posewear.pages.dev)
[![GitHub stars](https://img.shields.io/github/stars/atuizz/posewear?style=flat&color=black)](https://github.com/atuizz/posewear/stargazers)

[原版演示（非本 Fork）](https://posewear.pages.dev) · [手机部署教程](#手机部署cloudflare-pages) · [模型配置](#2-cloudflare-workers-ai-模型) · [构建排错](#常见部署报错) · [功能](#功能) · [常见问题](#常见问题) · [上游英文说明](README.en.md)

<img src="docs/home.jpg" alt="首页截图" width="900">

</div>

## 简介

本 Fork 基于 [atuizz/posewear](https://github.com/atuizz/posewear) 改造。保留姿势、深度姿势、服装、动画服装、人像及试穿工作台、收藏、搜索、批量生成、下载、PWA 等界面功能。生成请求由本站 `/api/generate` 通过 Cloudflare Pages Functions 调用你自己 Cloudflare 账户的 Workers AI Binding `AI`。

**无需 OpenAI、Gemini、豆包或自定义中转的 API Key。** 收藏与生成历史保存在访问者自己的浏览器；网站没有用户注册与业务数据库。图库图片从原素材站直接展示，部分图片加载、下载或生成参考能力受原站可用性和授权限制。

## 功能

| | |
|---|---|
| **素材库** | 姿势（多角度线稿）、深度姿势（热链原站深度图）、服装（按季节和类型分类）、动画服装（动画风穿搭）、人像（脸模参考，CC0）。每张图都有中文描述；深度姿势另附日文原名 |
| **搜索与筛选** | 中英文关键词、分类、排序、随机一张；每个素材有独立详情页，方便分享 |
| **试穿工作台** | 上传人物照，选服装和姿势，生成试穿图，或不用照片直接出图；一次可出多张，有前后对比、单张下载和打包下载 |
| **免费模型** | 固定 Cloudflare Workers AI FLUX.2 Klein 4B；不使用第三方模型或中转站 |
| **生成记录** | 保存在本机 IndexedDB，可查看、删除、清空，并可撤销 |
| **清楚的报错** | 额度不足、限流、模型失败、超时、安全审核等会提示错误；生成前可检测 AI Binding 是否存在 |
| **减少误拦截** | 默认开启。发送前把提示词改写成中性的电商试穿描述，不改变服装和姿势；关闭后按原样发送 |
| **收藏 / 最近 / 组合** | 本机保存，可导入导出，删除可撤销；可以把多个素材拼成一段提示词 |
| **18+ 开关** | 成人向分类默认隐藏，打开前需要确认年龄 |
| **PWA 与深色模式** | 可安装，看过的内容离线也能打开；深色模式跟随系统，也可手动切换 |
| **中文 / English 界面** | 默认中文，右上角切换 |

### 支持的生成模型

| 服务商 | 当前模型 | 调用方式 | 是否需要外部 API Key |
| --- | --- | --- | --- |
| Cloudflare Workers AI | `@cf/black-forest-labs/flux-2-klein-4b` | Pages Function `/api/generate` → `env.AI.run()` | **不需要** |

原版支持的 OpenAI、Gemini、豆包和自定义中转**不在本 Fork 的生成路径中使用**。原仓库保留的部分服务商兼容代码不代表本站会调用它们。图像生成能力取决于 Cloudflare 模型本身；保留工作台功能不等于能完全复现其他模型的试穿质量。

## 更新日志

### 2026-11-19 · 动画服装库上线

- 新增「动画服装」栏目：接入上游 COSTUME-ANIME-DB（[@giaaibusi](https://x.com/giaaibusi)）的 **1320 套**动画风穿搭，与写实服装同为 8 个分类（春 197 / 夏 237 / 秋 230 / 冬 232 / 内衣 197 / 派对礼服 36 / 泳装 52 / 性感 139），每套附中英文提示词。
- 内衣、性感类共 336 套按成人内容处理：默认隐藏，打开顶部「18+」开关后显示（默认公开 984 套）。
- 动画服装支持服装库的全部功能：分类 / 颜色 / 单品筛选、搜索建议、收藏、最近浏览、组合提示词、中英双语详情页与 sitemap；试穿工作台的服装步骤可直接「从动画服装选」。
- 首页新增上线公告条与动画服装计数，页脚与隐私说明补齐来源致谢；`scripts/fetch-assets.py` 新增 `anime` 数据源（顺带修复写实服装漏抓缩略图的问题）。

### 2026-10-31 · 深度姿势

- 新增「深度姿势」栏目：热链上游深度姿势图 288 组 / 1439 张，双人图走 18+ 开关。

## 截图

| 试穿工作台 | 深色模式 | 手机 |
|:---:|:---:|:---:|
| <img src="docs/studio.jpg" alt="试穿工作台" width="420"> | <img src="docs/dark.jpg" alt="深色模式" width="420"> | <img src="docs/mobile.jpg" alt="手机" width="180"> |

## 手机部署（Cloudflare Pages）

> **当前适用平台：Cloudflare Pages（`*.pages.dev`），不是 Cloudflare Workers Builds（`*.workers.dev`）。** 当前仓库采用 `functions/api/generate.js`、`functions/media/[[path]].js` 等 **Pages Functions** 路由。直接将此仓库作为普通 Worker 部署，不能自动转换这些路由。整个流程可只用手机浏览器和 Cloudflare/GitHub 网页完成，不需要电脑、Termux、Python、Pillow 或本地 Wrangler。

### 1. 创建 Pages 项目并连接 GitHub

手机进入 [Cloudflare 控制台](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git / Import an existing Git repository**，选 `umud66/posewear`。

**务必选 Pages，而非 Workers。** 可以通过创建项目时的界面判断：

- **Pages**：要求选择 Production branch、Build command、Build output directory，**不要求填写 Deploy command 或 Preview command**。
- **Workers Builds**：同时显示 Build command、Deploy command、Preview command。即使预览命令无法清空，也说明当前流程不适用于本 Fork 的 Pages Functions；**不要为了解决报错往此仓库随意添加 `previews` 块**。

当前改造代码在 `feature/cloudflare-free-ai` 分支，`main` 暂不包含该改造。创建 Pages 项目时使用以下设置：

| Pages 配置项 | 填写内容 |
| --- | --- |
| GitHub 仓库 | `umud66/posewear` |
| Production branch | `feature/cloudflare-free-ai` |
| Framework preset | `None` |
| Build command | `bash scripts/cloudflare-build.sh` |
| Build output directory | `dist` |
| Root directory | 仓库根目录（默认，通常留空或 `/`） |
| Deploy command | **Pages Git 集成无此配置，不填** |
| Preview command | **Pages Git 集成无此配置，不填** |
| Python | 使用 Cloudflare 构建环境中的 Python 3；本分支已包含 `.python-version`，无需安装 Pillow |

保存后，Cloudflare 自动拉取仓库、读取图库**文本元数据**、生成 `dist/` 并部署静态页面与 Pages Functions。脚本不会在 Cloudflare 中批量下载图库原图，也不会执行 `pip install pillow`。图库展示直接使用原作者的公开图片 URL，不依赖 `/media/*` 路由；用户主动选择 AI 参考图、复制或下载时才调用 `/api/asset`，不批量下载或长期保存图片。

### 2. Cloudflare Workers AI 模型

部署完成后进入 **Pages 项目 → Settings → Bindings → Add binding → Workers AI**，绑定变量名必须严格为：

```text
AI
```

绑定类型必须是 **Workers AI**，不是 Text/Secret 环境变量，也不是 API Token。已经在**同一个 Pages 项目、同一个环境**正确绑定 `AI` 的用户不需要重复配置。若新建了 Pages 项目，旧 Workers 项目上的绑定不会自动迁移；生产环境与预览环境可能要分别配置。绑定保存后**触发新的 Pages 部署**。

模型已经写在 `functions/api/generate.js`，不需要在控制台填写模型 ID：

```text
@cf/black-forest-labs/flux-2-klein-4b
```

### 3. 验证部署

部署成功后在手机打开：

```text
https://<你的-pages-项目名>.pages.dev/api/generate
```

正常识别绑定时会得到类似响应：

```json
{"ok":true,"model":"@cf/black-forest-labs/flux-2-klein-4b"}
```

**这是 Binding 检测，不代表模型已经成功生图。** 还需打开网站「试穿 → 设置 → 测试连接」，然后实际生成一张合规的普通穿搭图片测试模型调用。若接口返回 `ok:false`、404 或 503，检查 Pages Functions 是否部署、`AI` Binding 是否在正确的 Pages 环境中、绑定后是否重新部署。

### 常见部署报错

| 报错 / 现象 | 可能原因 | 应采取的操作 |
| --- | --- | --- |
| `Your Wrangler configuration is missing a previews block` | 当前 Cloudflare 项目在执行 **Workers Builds** 的 `wrangler preview`，不是 Pages Git 自动部署 | 回到 Workers & Pages，创建**Pages → Connect to Git** 项目；本项目不要使用 `npx wrangler preview` |
| **Preview command** 无法留空、页面不能保存 | 多半正在编辑 **Workers Builds** 设置 | **不必强行清空**，也不要填假命令；在 Pages 项目中配置 Git 构建 |
| `ModuleNotFoundError: No module named 'PIL'` | 跑了原版的全量构建，或使用了旧提交 | 确认分支 `feature/cloudflare-free-ai`，Build command 是 `bash scripts/cloudflare-build.sh`，并触发最新提交的新构建 |
| `/api/generate` 返回 404 | 部署到 Workers 或 Pages Function 未部署成功 | 确认是 Pages 项目、包含 `functions/api/generate.js`，检查构建日志 |
| `/api/generate` 返回 503 | Workers AI Binding `AI` 缺失或未生效 | 在当前 **Pages 项目和环境**绑定 `AI`，保存后重新部署 |
| 网页能打开、图片无法加载 | 部署了旧版 `/media/` 路由构建或原站禁止热链 | 部署最新提交，清理网站缓存；新版本静态图库直接请求原站图像，不再依赖 `/media` Function |
| 模型生成返回 429 | 免费额度耗尽、请求过快或接口限流 | 等待额度恢复、减少生成并发，并对公开接口设置限流 |

#### 如果已经建了 Workers 项目

不需要删除旧项目。为避免重写后端，**另外创建一个 Pages 项目**并连接同一个 GitHub 仓库；在新的 Pages 项目重新绑定 `AI`。Cloudflare Workers Builds 的 Preview command 与 Pages 的**分支预览部署**是两回事。Cloudflare 官方确实要求直接运行 `wrangler preview` 的 Worker 配置包含 `previews` 块，但给本仓库添加 `previews: {}` **不能**自动将 Pages Functions 改造成原生 Worker。若今后要沿用 `*.workers.dev` 和 Workers Builds，需要另行迁移静态资产配置、Worker 入口以及全部 API 路由，而不是只改一条命令。

参考官方文档：[Pages Git 集成](https://developers.cloudflare.com/pages/get-started/git-integration/) · [Pages AI Binding](https://developers.cloudflare.com/pages/functions/bindings/) · [Workers Preview 配置](https://developers.cloudflare.com/workers/previews/configuration/) · [从 Pages 迁移到 Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)

## 模型能力与免费额度

生成端仅使用 Cloudflare Workers AI。FLUX.2 Klein 4B 接收的参考图最多为 4 张，单张需要缩小到 512×512 以下；本 Fork 会缩放图像，并将第 4 张以后的参考素材拼版送入模型。原工作台仍保留多选、批量生成、前后对比与下载界面，但复杂姿势、细节、人物面部一致性无法保证与其他模型相同。

Cloudflare Workers AI 免费套餐提供按账户共享的日度 Neurons 额度（目前为每天 10,000 Neurons）；可能因其他站点的调用而消耗。额度不足时不会继续免费生成。公开网站请对 `/api/generate` 添加 Cloudflare WAF 限流，代码里的内存限流不等于全局安全防护。

> 版权与素材：原图片不打包进这个 Fork。原站可能限制外链、复制、重分发和自动访问，请尊重原站条款。Cloudflare 构建阶段仅请求元数据；用户使用图库或图片生成功能仍依赖源站的可用性与授权。

## 可选：本地构建（有电脑时）

手机部署**不需要**以下命令。如果将来在电脑上开发，可以使用 Fork 仓库，按需求选择元数据模式或原版全量构建。

```bash
git clone -b feature/cloudflare-free-ai https://github.com/umud66/posewear.git
cd posewear
# 轻量构建：只获取文本元数据，不需要 Pillow
bash scripts/cloudflare-build.sh
```

原始完整素材构建须另外准备 Pillow 和所有素材，并注意素材源站许可；不建议在 Cloudflare 的 Git 构建里做全量抓取。

## 测试

上游 Playwright 用例主要覆盖原版多服务商生成流程，尚不能替代当前 Cloudflare AI Binding 的真实环境测试。部署后的验收应包括：图库显示、原图/参考图加载、`/api/generate` Binding 检测及至少一次真实生图。

```bash
npm install && npx playwright install chromium
python3 -m http.server 8787 -d dist &
node tests/v12.js      # 图库、收藏、灯箱、路由、移动端
node tests/v13.js      # 试穿工作台全流程、深色模式、长文本
U=https://posewear.pages.dev node tests/v12.js   # 直接测线上
```

## 目录结构

```
src/                    前端源码，无框架
  app.js                图库、搜索筛选、收藏最近、灯箱、路由
  studio.js             试穿工作台：Cloudflare 模型接入、进度、结果、历史和提示词
  extras.js             批量操作、导入导出
  style.css             样式（含深色模式）
  sw.js / zip.js        离线缓存 / 打包下载
functions/api/generate.js  Pages Function，Cloudflare Workers AI 图像生成
functions/api/asset.js  Pages Function，仅用户主动操作时按需读取原图
functions/api/proxy.js  上游保留的原第三方服务商代理（本 Fork 生成不依赖）
build.py / post.py      轻量模式生成图库元数据、详情页、sitemap、_headers
costume_text.py         服装中英文描述
words.txt, tr_*.txt     词表与中英文翻译
depth/                  深度姿势素材包（只有文本，图片热链原站）
depthpack.py            把素材包编成可替换的 depths.json
scripts/cloudflare-build.sh   Cloudflare Pages Git 自动构建入口
scripts/fetch-assets.py  云端只读取元数据；全量模式可能下载素材
tests/                  Playwright 测试
docs/                   README 用图
```

## 常见问题

<details>
<summary><b>还要在网页中填写 API Key 吗？</b></summary>

不需要。本 Fork 通过部署者的 Cloudflare Workers AI Binding `AI` 访问 `env.AI.run()`。访问者无需输入密钥，模型额度由**你的 Cloudflare 账号**承担；请保护公开生成接口，避免额度被滥用。
</details>

<details>
<summary><b>为什么遇到 `previews`、`wrangler preview` 报错？</b></summary>

你大概率创建成了 Workers Builds 项目。本仓库当前是 Pages Functions 项目，应新建 **Cloudflare Pages → Connect to Git**，并按[手机部署](#手机部署cloudflare-pages)填写构建设置。Workers Preview 的 `previews` 配置不能修复 Pages Functions 与 Workers 入口不兼容的问题。
</details>

<details>
<summary><b>为什么会被模型安全审核拦下？</b></summary>

Cloudflare Workers AI 对输入与生成结果可能进行安全审核。请使用合规素材和正常穿搭描述；不要通过修改提示词绕过平台安全限制。工作台的“减少误拦截”只用于使正常描述更中性。
</details>

<details>
<summary><b>素材可以商用吗？</b></summary>

代码采用 MIT，**不包含图片的商用授权**；姿势、服装及深度姿势图片由各原作者拥有，具体用途必须遵守原站条款并在必要时取得授权。人像库作者声明为 CC0。
</details>

<details>
<summary><b>生成要多久、花多少钱？</b></summary>

实际耗时随模型负载、图片大小和参考图数量变化。Cloudflare 免费额度按账户每日 Neurons 计量，不等于无限免费；耗尽后请求会失败。具体可用额度、限制以 Cloudflare 控制台与官方计费文档为准。
</details>

## 路线图

- [ ] 增强 Cloudflare 免费模型图像一致性和生图测试
- [ ] 生成记录导出
- [ ] 增量更新素材（只下载新增内容）
- [ ] 更完整的英文界面文案

此 Fork 的问题请提交到 [umud66/posewear Issues](https://github.com/umud66/posewear/issues)；原项目见 [atuizz/posewear](https://github.com/atuizz/posewear)。

## 参与贡献

欢迎提 Issue 和 PR：

1. Fork 后新建分支；
2. 改动前端后运行 `python3 build.py` 和 `node tests/v12.js && node tests/v13.js`；
3. PR 里说明改了什么，界面改动附截图。

文案请保持口语、简洁；不提交任何素材图片或密钥。

## 致谢

- [AI Pose Gallery](https://ai-pose-gallery.pages.dev/)：姿势线稿
- [AI Pose Depth Gallery](https://ai-pose-depth-gallery.pages.dev/)：深度姿势，作者 [ギア / @giaaibusi](https://x.com/giaaibusi)。页面热链原图，非官方汉化；图片不进本仓库
- [AI Costume Gallery](https://ai-costume-gallery.pages.dev/)：服装图，作者 [@giaaibusi](https://x.com/giaaibusi)
- [AI Costume Anime Gallery](https://ai-costume-anime-gallery.pages.dev/)：动画服装图，作者 [@giaaibusi](https://x.com/giaaibusi)
- [AI Portrait Gallery](https://ai-portrait-gallery.pages.dev/)：人像，作者 [@agi_aibusi](https://x.com/agi_aibusi)，CC0
- [wzc520pyfm/gen-ai-pose-image](https://github.com/wzc520pyfm/gen-ai-pose-image)、[paipiange/nvzhuang](https://github.com/paipiange/nvzhuang)：给了很多思路的同类项目

## 许可与素材边界

| 内容 | 是否在本仓库 | 许可 |
|---|---|---|
| 代码、页面文案、构建脚本 | 是 | [MIT](LICENSE) |
| 姿势、服装图片和原始数据 | 否；云端构建读取元数据，图片直接使用原站图片 URL | 归原作者 [@giaaibusi](https://x.com/giaaibusi) 所有（[AI Pose Gallery](https://ai-pose-gallery.pages.dev/) / [AI Costume Gallery](https://ai-costume-gallery.pages.dev/) / [AI Costume Anime Gallery](https://ai-costume-anime-gallery.pages.dev/)），原站未标明开放许可 |
| 人像图片 | 否，按需访问原站 | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hans)，作者 [@agi_aibusi](https://x.com/agi_aibusi)（[AI Portrait Gallery](https://ai-portrait-gallery.pages.dev/)） |
| 深度姿势图片 | 否，页面 `<img>` 热链 [AI Pose Depth Gallery](https://ai-pose-depth-gallery.pages.dev/) | 归作者 [ギア / @giaaibusi](https://x.com/giaaibusi)。本仓库只有文本元数据和译名 |
| 深度姿势文本元数据 | 是，`depth/packs/` | 日文原文归原作者，中文译名为本站 |
| README 截图 | 是 | 截图里的图片素材同上，归各自作者 |

- MIT 只覆盖代码，不覆盖任何图片和数据。
- 想转载、商用或二次分发姿势、服装图片，请先联系原作者 @giaaibusi，以原站说明为准。
- 人像为 CC0，可商用、可修改、无需署名；均为 AI 生成的虚构人物，不要用来冒充真人。原作者希望不要原样批量转载。
- 自己部署时，请保留页面里的来源与作者说明。
