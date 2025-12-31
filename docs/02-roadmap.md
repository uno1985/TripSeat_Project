# tripSeat 開發路線圖 (Roadmap)

為了確保專案順利推進，我將開發流程分為三個階段，從核心價值 (MVP) 出發，逐步完善系統。

## 🏁 階段 0：基礎建設與資料建模 (目前進度)

- [x] 資料庫 Schema 設計 (`database_schema.md`)
- [x] 需求分析與角色定義 (`REQUIREMENTS_ANALYSIS.md`)
- [x] 視覺風格確認 (依據設計師樣板)
- [ ] **Next 階段：** 配置 `db.json` 並啟動 `json-server-auth`。

## 🏗️ 階段 1：核心功能 MVP (最小可行性產品)

*目標：建立 React + Bootstrap 開發環境，並串接 Mock API。*

1. **開發環境初始化**：建立 Vite + React + Bootstrap 專案。
2. **Mock Backend 啟動**：配置 `json-server-auth` 並定義認證規則。
3. **身分系統實作**：實作登入/註冊頁面，將資料存入 JSON 並取得 JWT。
4. **旅程瀏覽與篩選**：從 API 抓取旅程資料，實作 Bootstrap 搜尋 Bar 功能。
5. **媒合流程**：實作報名 Modal 並發送 POST 請求至 `applications`。

## 🌟 階段 2：社群感與信任建立 (進階功能)

*目標：增加用戶黏性與安全性。*

1. **心得系統**：旅遊心得牆、撰寫/評論功能 (API 串接)。
2. **通知系統**：建立通知中心介面，輪詢或模擬通知推送。
3. **互動加強**：私訊功能介面、追蹤功能。
4. **管理功能**：實作管理員視圖，進行 blocked/soft delete 操作。

## 📈 可行性評估報告

- **技術優點**：使用 `json-server-auth` 能模擬真實的登入權限控管（如：沒帶 Token 不能報名），非常適合開發訓練。
- **開發方向**：維持 MVP 第一、組件化開發，優先完成首頁與旅程詳情。
