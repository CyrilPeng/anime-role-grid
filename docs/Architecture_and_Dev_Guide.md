# AnimeGrid V2 - 架构与开发手册

本文档旨在为后续开发提供清晰的架构视图与开发规范。基于 2025-12 也就是现在的最新重构版本。

---

## 🏗️ 1. 核心架构总览 (System Architecture)

AnimeGrid 是一个 **Serverless 全栈应用**。它不依赖传统后端服务器，而是完全运行在 **Cloudflare Pages** 生态上。

### 1.1 技术栈 (Tech Stack)
*   **前端 (Frontend)**: Vue 3 + TypeScript + Vite + UnoCSS
*   **状态管理 (State)**: VueUse (`createGlobalState`) + LocalStorage 持久化
*   **后端 (Backend)**: Cloudflare Pages Functions (运行在 Edge 上的 Worker)
*   **数据库 (Database)**: Cloudflare D1 (SQLite at Edge)
*   **图片处理**: Cropper.js (前端裁切) + Canvas (前端合成)

### 1.2 数据流向 (Data Flow)

```mermaid
graph TD
    User[用户] --> |操作/点击| VueComp[Vue 组件 (Pages/Components)]
    
    subgraph Frontend [前端应用]
        VueComp --> |读取/修改| Store[GridStore (src/stores)]
        Store <--> |持久化| LocalStorage[浏览器缓存]
        
        VueComp --> |调用| API_Service[API Service (src/services/api.ts)]
        Store --> |调用| API_Service
    end
    
    subgraph Backend [Cloudflare Edge]
        API_Service --> |HTTP Request| Proxy[/functions/api]
        
        Proxy --> |SQL Query| D1[(D1 Database)]
        Proxy --> |Fetch| External_API[Bangumi API]
    end
```

---

## 📂 2. 目录结构与职责 (Directory Structure)

我们采用 **"特性分离"** 与 **"分层架构"** 相结合的方式。

| 路径 | 类型 | 核心职责 | 开发注意 |
| :--- | :--- | :--- | :--- |
| `src/stores/` | **数据中枢** | **核心推荐**。管理全局状态（当前模版、格子内容）。 | 任何跨组件的数据交互，优先考虑放这里，不要用 Event Bus。 |
| `src/services/` | **服务层** | **唯一出口**。所有 `fetch` 请求必须封装在此。 | **禁止**在组件里直接写 `fetch`。要统一管理 Token 和错误处理。 |
| `src/logic/` | **业务逻辑** | 纯函数、复杂计算、导出逻辑、静态数据。 | 把“脏活累活”（如 Canvas 绘图、Excel处理）扔在这里，保持组件清爽。 |
| `src/pages/` | **页面** | 路由分发、页面级状态。 | `Home.vue` (主页), `ViewTemplate.vue` (模版页), `CreateTemplate.vue` (新建)。 |
| `functions/api/` | **后端 API** | 处理数据库读写、第三方 API 代理。 | 这里的代码运行在服务器端。**注意区分开发/生产环境**。 |
| `schema.sql` | **数据库** | 数据库结构定义。 | 每次修改后，记得以此为准检查代码一致性。 |

---

## 🛠️ 3. 关键开发规范 (Development Rules)

### 3.1 统一 API 请求 (The Golden Rule)
*   **❌ 错误示范**: 在 `Search.vue` 里写 `fetch('https://api.bgm.tv/search')`。
    *   *后果*: Token 泄露、CORS 报错、无法统一维护。
*   **✅ 正确示范**: 
    1. 在 `src/services/api.ts` 添加方法 `searchBangumi(...)`。
    2. 在组件里调用 `await api.searchBangumi(...)`。

### 3.2 本地开发环境 (Local Development)
由于项目依赖 Cloudflare Functions (后端接口)，普通的 `npm run dev` 只能启动前端，会导致接口 404。
*   **✅ 必须使用**: `npm run dev:full`
*   该命令会同时启动 Vite 和 Wrangler，模拟真实的 Edge 环境。

### 3.3 数据库变更 (Database Changes)
如果你想给表格增加一列（例如增加“投票数”）：
1. 修改 `schema.sql` (作为文档和最终真理)。
2. 创建 `migrations/000x_desc.sql` (如果是生产环境迁移)。
3. **重点**: 检查 `functions/api/...` 下的 `.bind()` 参数顺序！SQLite 对参数顺序非常敏感，少一个或错一个都会崩。

### 3.4 状态管理 (State Management)
*   **gridStore (`src/stores/gridStore.ts`)** 是应用的大脑。
*   它负责把数据存到 `localStorage` (`anime-grid-data-v2`)。
*   如果你发现用户刷新页面后数据丢了，去检查 `gridStore` 里的 `useStorage` key 是否正确。

### 3.5 类型复用 (Type Sharing)
前端和后端应当**共享**数据接口定义。这一条能充分发挥 Monorepo + TypeScript 的优势。
* **位置:** 建议放在 `src/types/` 下，或者 `functions/types` (如果需要物理隔离)。目前主要在 `src/types/grid.ts`。
* **原则:** 数据库的返回结构、API 的 Response 结构，必须定义在这里，前后端共用。
* **好处:** 当你修改了数据库结构，前端代码会立即报错（红色波浪线），防止上线后崩溃。
* **示例:**
```typescript
// src/types/grid.ts
export interface GridItem {
  id: string;
  content: string;
  // 如果后端改了这里，前端 import 这个接口的地方全都会报错提醒你
}
```

---

## 🚀 4. 常见任务指南 (Recipes)

### 任务 A: 添加一个新的官方模版
1. 打开 `src/logic/templates.ts`。
2. 在 `TEMPLATES` 数组中添加对象。
3. **ID 必须唯一**且只能包含字母、数字、下划线 (e.g., `2025_genshin`)。
4. 无需动数据库，代码发布即生效。

### 任务 B: 开发一个新的后端接口 (e.g., 获取排行榜)
1. 在 `functions/api/` 下新建文件，例如 `functions/api/rank/list.ts`。
2. 导出 `onRequestGet` 函数。
3. 如果需要查库，使用 `context.env.DB.prepare(...)`。
4. 在前端 `src/services/api.ts` 封装对应的 fetch 函数。

### 任务 C: 调试 "500 Internal Server Error"
1. 这种错误通常发生在后端 (`functions/`)。
2. 查看运行 `npm run dev:full` 的终端窗口。Wrangler 会打印后端的报错堆栈。
3. 常见原因：SQL 语法错误、参数绑定数量不匹配 (`bind` 参数个数不对)、环境变量缺失。

---

## 🔮 5. 未来展望 (Roadmap)

目前的架构已经足以支撑 **UGC (用户生成内容)** 和 **数据分析**。

*   **P1 - 党争投票 (Party War)**:
    *   基于 `saves` 表的数据，聚合统计每个 Slot 里出现频率最高的角色。
    *   后端新增 `/api/stats` 接口。
*   **P2 - 候选池 (Candidate Pool)**:
    *   在 `CustomTemplate` 表中增加 `pool` 字段 (JSON)。
    *   前端 `Search.vue` 支持 "仅从池中筛选" 模式。

---

## 🧪 6. 测试策略与工作流 (Testing Strategy)

### 6.1 什么时候跑测试？
*   **开发时 (Watch Mode)**: 只要你正在修改 `src/logic` 或 `src/services` 里的代码，请在终端常驻运行 `npm run test`。改一行代码，测试自动跑一遍，红了立刻修，不要等到最后。
*   **提交前 (Pre-commit)**: 确保所有测试全绿 (`PASS`)。

### 6.2 测什么？(Test Scope)
我们不追求 100% 覆盖率，而是追求 **高ROI (投入产出比)**。

| 优先级 | 这里面的代码 | 为什么测？ | 怎么测？ |
| :--- | :--- | :--- | :--- |
| **P0 (必测)** | `src/services/api.ts` | **接口契约**。这里错了，所有功能全挂。 | 模拟 fetch (Mock)，验证 URL 和参数是否正确。 |
| **P1 (推荐)** | `src/logic/*.ts` | **纯函数逻辑**。比如图片生成参数计算、数据转换。 | 写单元测试，验证输入输出 (Input/Output)。 |
| **P2 (选测)** | 复杂的 Vue 组件 | 如果一个组件逻辑特别绕 (比如 `Search.vue` 的筛选)，可以测。 | 使用 `@vue/test-utils` 挂载组件进行交互测试。 |
| **P3 (不测)** | 简单的 UI 组件 | 比如 `Header.vue`，只有展示逻辑。 | 人肉看一眼就行。 |

### 6.3 示例代码
参考 `src/tests/api.test.ts`。复制它，改改就能测别的服务。

---

**最后的一句话**:
> Keep the Logic Pure, Keep the Components Dumb.
> (保持逻辑纯粹，保持组件“傻瓜化”——把复杂的思考交给 `store` 和 `services`。)
