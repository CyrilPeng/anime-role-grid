# 如何部署到 Cloudflare Pages (免费 & 推荐)

Cloudflare Pages 是目前最推荐的静态网站托管服务，**完全免费**，速度快，且不需要你维护服务器。

以下是详细的保姆级教程：

## 准备工作

1.  你需要一个 [GitHub](https://github.com/) 账号。
2.  你需要将本项目上传到 GitHub 仓库（如果你还没做的话）。

## 步骤一：上传代码到 GitHub

如果你已经把代码上传到了 GitHub，请跳过此步。

1.  在 GitHub 上新建一个仓库（Create a new repository），比如叫 `anime-grid`。
2.  在你的本地项目文件夹中打开终端，执行以下命令：

```bash
# 初始化 git (如果还没初始化)
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 关联远程仓库 (替换成你自己的仓库地址)
git remote add origin https://github.com/你的用户名/anime-grid.git

# 推送到 GitHub
git push -u origin master
```

## 步骤二：在 Cloudflare Pages 上部署

1.  访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 并注册/登录。
2.  在左侧菜单点击 **"Workers & Pages"**。
3.  点击蓝色的 **"Create application"** 按钮。
4.  选择 **"Pages"** 标签页，然后点击 **"Connect to Git"**。
5.  选择 **GitHub**，授权 Cloudflare 访问你的 GitHub 账号。
6.  在列表中选择你刚才上传的 `anime-grid` 仓库，点击 **"Begin setup"**。

## 步骤三：配置构建设置 (关键步骤)

在 "Set up builds and deployments" 页面，请按如下填写：

*   **Project name**: 默认即可（这将是你的域名前缀，例如 `anime-grid.pages.dev`）。
*   **Production branch**: `master` (或者 `main`)。
*   **Framework preset**: 选择 **Vue**。
*   **Build command**: `npm run build` (Cloudflare 会自动填好)。
*   **Build output directory**: `dist` (Cloudflare 会自动填好)。

**环境变量 (可选但推荐):**
如果你的项目需要 Bangumi 搜索功能，你需要在这里添加环境变量：
1.  点击 **"Environment variables (advanced)"**。
2.  添加变量：
    *   Key: `VITE_BANGUMI_ACCESS_TOKEN`
    *   Value: `你的Bangumi Token`
    *   Key: `VITE_BANGUMI_USER_AGENT`
    *   Value: `你的UserAgent`

3.  点击 **"Save and Deploy"**。

## 步骤四：等待部署完成

Cloudflare 会自动开始下载代码、安装依赖、构建项目。
*   通常只需要 1-2 分钟。
*   完成后，你会看到 **"Success!"** 的提示。
*   点击顶部的链接（例如 `https://anime-grid.pages.dev`），即可访问你的网站！

## 以后如何更新？

非常简单！你只需要修改本地代码，然后推送到 GitHub：

```bash
git add .
git commit -m "更新了新功能"
git push
```

Cloudflare 会自动检测到 GitHub 的变动，并自动为你重新构建和发布新版本。你什么都不用做！
