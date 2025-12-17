# 🔌 API Reference Guide

本文档详细描述了后端服务 (`functions/api`) 提供的所有 HTTP 接口。

## 1. 搜索 (Search)

### `POST /api/search`
通用搜索代理接口，用于转发请求到 Bangumi API 并规避跨域问题。

*   **Auth**: 需要 Header `Authorization: Bearer <Access_Token>`
*   **Request Body**:
    ```json
    {
      "searchMode": "character", // 可选: 'character' | 'subject' | 'person'
      "keyword": "Frieren",
      "filter": { ... },       // Bangumi 搜索过滤器
      "limit": 20,
      "offset": 0
    }
    ```
*   **Response**:
    返回 Bangumi API 的原始搜索结果列表。

---

## 2. 模版 (Templates)

### `POST /api/template/create`
创建新的 UGC (用户自定义) 模版。

*   **Request Body**:
    ```json
    {
      "title": "My Custom Grid",
      "type": "grid",
      "config": {
        "cols": 4,
        "items": ["Label 1", "Label 2", ...],
        "creator": "User Name",
        "templateName": "Naruto Styles"
      }
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "id": "a1b2c" // 生成的短 ID
    }
    ```

### `GET /api/template/[id]`
获取指定的自定义模版详情。

*   **Params**: `id` (Template ID)
*   **Response**:
    ```json
    {
      "type": "grid",
      "title": "My Custom Grid",
      "config": { ... }, // 自动解析后的 JSON 对象
      "created_at": 1734412345
    }
    ```
*   **Errors**:
    *   404: Template not found

---

## 3. 存档与分享 (Saves)

### `POST /api/save`
保存用户的填表记录，用于生成“同款”或数据分析。

*   **Request Body**:
    ```json
    {
      "templateId": "2024_general-anime",
      "customTitle": "My 2024 List",
      "items": [
        { "label": "Best Boy", "character": { "id": 123, "name": "Himmel", "image": "..." } }
      ],
      "deviceType": "mobile",
      "referer": "qrcode"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "id": "uuid-v4-string"
    }
    ```

---

## 4. 全站热门 (Trending)

### `GET /api/trending`
获取全站被填次数最多的角色/作品。

*   **Query Params**:
    *   `period`: `24h` | `week` | `all` (默认 `24h`)
    *   `limit`: Number (默认 100)
    *   `category`: `character` | `subject` (可选，筛选类别)
*   **Response**:
    ```json
    {
      "results": [
        {
          "id": 123,
          "name": "Frieren",
          "image": "https://...",
          "count": 500
        },
        ...
      ]
    }
    ```

