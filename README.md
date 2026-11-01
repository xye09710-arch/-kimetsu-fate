# 鬼灭命运录 · 原型 v0.1

平行人生实验室的独立情境测评项目。12 道共同题 → 双阵营揭晓 → 8 种原创身份之一 → 选择解读、能力与代价、牵绊、命运短篇 → PNG 身份卡。

非官方同人创作，与《鬼灭之刃》原作权利方无关联或授权关系。仅借用题材入口和阵营称谓，题目、能力、身份、短篇及视觉均为原创，不包含官方角色立绘、截图、音乐或标识。娱乐体验，不用于心理诊断或未来预测。

## 运行与测试

无站点运行依赖，使用 Node.js 18+：

```sh
npm start
# http://127.0.0.1:8787
npm test
npm run build
```

浏览器回归需要本机安装 Playwright 与 Chrome。先运行 npm test 生成覆盖八种身份的样本，再运行 npm run test:browser。支持 CHROMIUM_PATH、TEST_BASE_URL；默认 Windows Chrome。本机依赖不作为站点资源发布。

## 结构

- index.html / css/ / assets/：移动端优先界面与原创山谷 SVG。
- js/data.js：12题48选项、8种原创身份与完整短篇，独立内容源。
- js/scoring.js：纯函数评分，Node 和浏览器共享。
- js/app.js：答题、回退编辑、揭晓、档案、PNG 导出。
- docs/PRODUCT.md：产品、评分和交互草案。
- docs/TESTING.md：本次验证记录及局限。
- scripts/build.cjs：只复制6个运行文件到 dist，不打包文档和测试。

## 独立预览部署

本仓库此前只有 README，没有既有部署流程。当前只提交原型分支和草稿 PR，不自动发布、不修改其他项目。

运行 npm run build，把 dist 作为静态站点发布目录；构建命令为 npm run build。可将 dist 上传到新的独立 Netlify 预览站，或连接本仓库的原型分支。无环境变量、服务端、登录或密钥。不要上传仓库根目录。上线后检查首页、答题、揭晓、8种档案以及身份卡下载；iOS Safari、Android Chrome 与内置浏览器仍需真机验收。

答案仅存页面内存，刷新清空；无埋点、远程请求、账户或持久化。相同身份共享预写短篇，依据当前选择生成解释和四类选择次数，不调用生成式接口。
