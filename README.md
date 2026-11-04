# 鬼灭命运录 · v0.5

平行人生实验室的非官方静态同人作品：16 道情境题 → 角色揭晓 → 六维动态解读 → 人物相似处与内在矛盾 → 原创鬼灭世界情境 → 留言 → 900×1600 PNG 卡。

16 位常规角色与隐藏继国缘一共 17 张独立肖像、17 套专属主题。v0.5 保留 v0.4.1 的题目、64 选项支持映射、评分与六维数值算法、0.1% 独立彩蛋。无账号、支付墙、外部模型 API 或答案上传；刷新与重测清空答案。

角色归原作权利方所有；文本与肖像为原创同人表达，无官方授权。人物解读包含设定剧透；命运情境不是原作剧情或台词。结果只作娱乐叙事参考，不是心理测量或道德评判。

## Windows 本地运行

安装 Node.js 22 LTS 与 Git。PowerShell 中首次获取：

```powershell
git clone --branch feat/fate-prototype https://github.com/xye09710-arch/-kimetsu-fate.git
Set-Location .\-kimetsu-fate
npm start
```

浏览器打开 `http://127.0.0.1:8787`，保持终端运行，Ctrl+C 停止。站点没有 npm 运行依赖，无需先执行 npm install。

已有仓库时，在仓库目录更新：

```powershell
git fetch origin
git switch feat/fate-prototype
git pull --ff-only origin feat/fate-prototype
npm start
```

若工作区有自己的修改，请先保存后切换或更新。`main` 尚未包含这个原型。

## 测试与构建

```powershell
npm test
npm run build
```

评分测试生成 `test-results/fixtures.json`；报告测试检查全部角色的文本长度、分数区间变化与主题文字对比度。静态产物在 `dist`。

可选浏览器开发工具（不影响站点运行）：

```powershell
npm install --no-save --package-lock=false playwright
# 另一个终端保持 npm start 运行
$env:CHROMIUM_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
npm run test:browser
```

Chrome 路径不同则修改该变量；也可以 `npx playwright install chromium` 并将 CHROMIUM_PATH 指向安装的浏览器。浏览器检查四种宽度、全部 17 位角色、PNG 实际下载与肖像失败回退。截图与报告写入忽略的 `test-results`。详见 [验证说明](docs/TESTING.md)。

## 文件与内容

- `js/data.js`、`js/scoring.js`：原题、支持映射与评分；本次未改动。
- `js/report.js`：17 位角色长篇解读、六维三档文案和主题；纯静态、确定性组合。
- `js/app.js`、`js/radar.js`、`css/style.css`：报告、主题图表、短文 PNG 与手机排版。
- `assets/portraits`：保留全部原始肖像；首页仍使用 `assets/wisteria-night.png`。
- [产品与内容来源](docs/PRODUCT.md)、[肖像来源](docs/PORTRAITS.md)、[测试说明](docs/TESTING.md)。

## Netlify

连接 `feat/fate-prototype`，Build command 为 `npm run build`，Publish directory 为 `dist`，Node.js 22，Base directory 留空；`netlify.toml` 已提供默认设置。构建复制 25 个运行文件，包含报告模块与 17 张肖像，不发布测试和开发文档。无环境变量或密钥需求。推送可能触发已有部署，本次未验证公网部署状态。

隐藏缘一每次完成答题独立触发 0.1%，不是稀有人格或能力认证，导出不会重抽。静态源码公开，不提供防篡改或访问鉴权。iOS、Android 与内置浏览器长按保存仍需真机验收。

## 文案润色稿

已接入用户提供的《鬼灭命运录_v0.5_文案润色稿.txt》，更新首页、17 角色报告、六维区间解读与分享卡短文。题目、评分、肖像和隐藏机制保留；少量六维区间语句为满足 120 字上限而压缩，详见 [润色稿接入记录](docs/COPY_EDIT.md)。本地运行方式不变。
