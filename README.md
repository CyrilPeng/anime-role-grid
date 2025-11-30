# Anime Role Grid (动画角色喜好表)

一个现代化的、响应式的动画角色喜好表生成器。基于 Vue 3 + Vite + TypeScript 构建。

## ✨ 功能特点

- **多模板支持**：内置经典(5x3)、扩展(5x6)、Bingo(3x3)、CP问卷(4x4)等多种模板，支持一键切换。
- **响应式设计**：完美适配手机和电脑。手机端表格自动缩放，页面操作流畅。
- **高清导出**：无论在手机还是电脑上，都能生成 3倍高清分辨率 的 PNG 图片，文字清晰，排版完美。
- **数据持久化**：自动保存你的填写进度，刷新页面不丢失。
- **Bangumi 搜索**：集成 Bangumi API，支持搜索并直接添加角色图片。
- **自定义上传**：支持上传本地图片并裁剪。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` (如果没有则新建)，并填入你的 Bangumi API Token (可选，用于搜索功能)：

```env
VITE_BANGUMI_ACCESS_TOKEN="你的Token"
VITE_BANGUMI_USER_AGENT="你的UserAgent"
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

## 🛠️ 如何添加新模板

本项目设计了灵活的模板系统，你可以轻松添加自定义模板。

1.  打开文件：`src/logic/templates.ts`
2.  在 `TEMPLATES` 数组中添加一个新的对象：

```typescript
{
  id: 'my-new-template',      // 唯一ID
  name: '我的新模板 (4x2)',    // 显示名称
  cols: 4,                    // 列数
  items: [                    // 格子标签列表
    '标签1', '标签2', '标签3', '标签4',
    '标签5', '标签6', '标签7', '标签8'
  ]
}
```

3.  保存文件，页面会自动刷新，你就能在下拉菜单中看到新模板了！

## 📄 部署指南

本项目完全静态，可以部署到任何静态托管服务。推荐使用 **Cloudflare Pages**。

详细部署教程请查看：[DEPLOY.md](./deploy.md)
