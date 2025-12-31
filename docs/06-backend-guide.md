# 🛠️ Mock Backend (json-server) 使用指南

本專案使用 `json-server` 與 `json-server-auth` 來模擬後端 API 與 JWT 認證流程。

## 🚀 快速啟動

在專案根目錄執行以下指令：

```powershell
# 安裝依賴 (如果尚未安裝)
npm install json-server json-server-auth

# 啟動伺服器 (包含認證功能)
npm run backend
```

### ❓ 指令差異分析：`--watch` vs `json-server-auth`

| 指令 | 認證 (JWT) | 自動更新數據 | 使用時機 |
| :--- | :---: | :---: | :--- |
| `json-server --watch db.json` | ❌ 無 | ✅ 有 | 只需簡單調用數據，不需要登入功能時。 |
| `json-server-auth db.json` | ✅ 有 | ✅ 有 | **本專案推薦**。開發註冊、登入或權限控管功能時。 |

**`--watch` 的作用是什麼？**

- **即時監控**：當你手動修改 `db.json` 檔案時，伺服器會自動重新載入，不需重啟。
- **持久化保存**：當你發送 `POST`、`PUT`、`PATCH` 或 `DELETE` 請求時，變更會**自動寫入**並儲存到 `db.json` 檔案中。

> [!TIP]
> 啟動後，API 根目錄為：`http://localhost:3001`

---

## 🔐 認證 (Authentication)

`json-server-auth` 提供了完整的認證流程：

### 1. 註冊 (Register)

- **Endpoint**: `POST /register`
- **Body**: `{ "email": "...", "password": "...", "name": "..." }`
- **結果**: 返回 `accessToken` 與 `user` 資訊。

### 2. 登入 (Login)

- **Endpoint**: `POST /login`
- **Body**: `{ "email": "...", "password": "..." }`
- **結果**: 返回 `accessToken`。

### 3. 受保護的請求

在發送需要權限的請求時（如 POST, PUT, DELETE），需在 Header 加入：
`Authorization: Bearer <YOUR_ACCESS_TOKEN>`

---

## 📊 數據操作 (REST API)

### 核心 Endpoints

- `GET /users`: 獲取所有使用者
- `GET /trips`: 獲取所有旅程
- `GET /trips/{id}`: 獲取特定旅程詳情
- `POST /applications`: 提交報名申請

### 進階查詢 (Power User)

`json-server` 支持非常強大的查詢參數：

| 功能 | 參數範例 | 說明 |
| :--- | :--- | :--- |
| **模糊搜尋** | `/trips?q=跨年` | 在所有欄位搜尋「跨年」關鍵字 |
| **欄位過濾** | `/trips?category=登山` | 僅篩選分類為登山的旅程 |
| **排序** | `?_sort=price&_order=desc` | 按價格從高到低排序 |
| **分頁** | `?_page=1&_limit=10` | 獲取第一頁，每頁 10 筆 |
| **關聯查詢** | `/trips?_embed=itineraries` | 同時取出該旅程下的行程表 |
| **數值範圍** | `?price_gte=100&price_lte=500` | 篩選價格在 100~500 之間 |

---

## 🛠️ 下一階段建議

在前端 `src/services/api.js` 中，可以使用 `axios` 進行封裝：

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// 自動帶入 Access Token 的攔截器
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```
