# tripSeat JSON 資料庫架構 (Refined v3)

本文件定義平台之 JSON 資料結構，適用於 `json-server` 並符合業務與安全性需求。

## 1. users (使用者)

| 欄位 | 說明 | 備註 |
| :--- | :--- | :--- |
| id | 使用者唯一 ID (UUID) | PK (Primary Key) |
| role | visitor / member / admin | |
| name | 顯示名稱 | |
| email | 電子信箱 | Unique Index |
| email_verified | 布林值 (Email 驗證狀態) | |
| password | 密碼 (json-server-auth) | |
| google_id | Google 登入識別 | |
| line_id | LINE 帳號 | |
| phone | 手機號碼 | |
| phone_verified | 布林值 (手機驗證狀態) | |
| avatar | 大頭貼 URL | |
| intro | 個人介紹 | |
| status | active / blocked | |
| blocked_reason | 封鎖原因 | |
| trust_score | 信任分數 (0-100) | 參照公式 A |
| trips_created | 發起旅程次數 | 冗餘欄位 (效能優化用) |
| trips_joined | 參加旅程次數 | 冗餘欄位 (效能優化用) |
| trips_completed | 成功出團次數 | |
| rating_average | 平均評分 | 參照公式 B |
| last_login_at | 最後登入時間 | |
| created_at | 建立時間 | |
| updated_at | 更新時間 | |
| deleted_at | 軟刪除時間 | |

## 2. trips (旅程)

| 欄位 | 說明 | 備註 |
| :--- | :--- | :--- |
| id | 旅程 ID (UUID) | PK |
| owner_id | 建立者 ID (`users.id`) | Index |
| title | 旅程標題 | |
| host_rating | 團主目前評分 | 參照 `users.rating_average` |
| cancellation_policy | 取消政策說明 | |
| location | 地區 (e.g. 台北市) | |
| meeting_point | 精確集合地點 | |
| start_date | 開始日期 | |
| end_date | 結束日期 | |
| deadline | 報名截止日期 | |
| price | 費用 | |
| current_participants| 目前成行人數 | |
| max_people | 人數上限 | |
| category | 旅程分類 (e.g. 登山) | |
| tags | 旅程標籤 (Array) | |
| vibe_text | 氛圍描述 | |
| vibe_tags | 氛圍標籤 (Array) | |
| image_url | 旅程主圖 URL | |
| views | 瀏覽次數 | |
| is_featured | 是否推薦 | |
| description | 旅程詳細介紹 | |
| notes | 團主 Q&A 或注意事項 | Markdown |
| status | open / confirmed / cancelled / blocked | |
| blocked_reason | 下架原因 | |
| created_at | 建立時間 | |
| updated_at | 更新時間 | |
| deleted_at | 軟刪除時間 | |

## 3. itineraries (行程計畫)

| 欄位 | 說明 | 備註 |
| :--- | :--- | :--- |
| id | 行程項目 ID (UUID) | PK |
| trip_id | 所屬旅程 ID | Index |
| day | 第幾天 | |
| time | 時間 | |
| type | activity / transport / food | |
| icon | 顯示用圖示 (e.g. Emoji 或 Icon Name) | |
| title | 行程標題 | |
| location_lat | 地理緯度 | |
| location_lng | 地理經度 | |
| note | 備註 | |
| updated_at | 更新時間 | |
| deleted_at | 軟刪除時間 | |

## 4. applications (報名申請)

| 欄位 | 說明 | 備註 |
| :--- | :--- | :--- |
| id | 申請 ID (UUID) | PK |
| trip_id | 旅程 ID | Index |
| user_id | 申請者 ID | Index |
| intro | 自我介紹 | |
| read_notes | 是否已讀並同意注意事項 | |
| status | pending / accepted / rejected | |
| rejected_reason | 拒絕原因 | |
| cancellation_reason | 申請者取消原因 | |
| processed_at | 審核時間 | |
| created_at | 申請時間 | |
| updated_at | 更新時間 | |
| deleted_at | 軟刪除時間 | |

## 5. participants (成行成員)

| 欄位 | 說明 | 備註 |
| :--- | :--- | :--- |
| id | 紀錄 ID (UUID) | PK |
| trip_id | 旅程 ID | Index |
| user_id | 使用者 ID | Index |
| role | owner / member | |
| created_at | 加入時間 | |
| updated_at | 更新時間 | |
| deleted_at | 軟刪除時間 | |

## 6. reviews (評價心得)

| 欄位 | 說明 | 備註 |
| :--- | :--- | :--- |
| id | 心得 ID (UUID) | PK |
| trip_id | 旅程 ID | Index |
| user_id | 作者 ID | Index |
| rating | 1-5 星 | |
| content | 心得內容 | |
| images | 照片 URL (Array) | |
| likes_count | 按讚數 | |
| is_public | 是否公開 | |
| created_at | 建立時間 | |
| updated_at | 更新時間 | |
| deleted_at | 軟刪除時間 | |

## 7. messages (私訊/聊天)

| 欄位 | 說明 | 備註 |
| :--- | :--- | :--- |
| id | 訊息 ID (UUID) | PK |
| sender_id | 傳送者 ID | Index |
| receiver_id | 接收者 ID | Index |
| content | 訊息內容 | |
| is_read | 是否已讀 | |
| created_at | 傳送時間 | |
| deleted_at | 軟刪除時間 | |

## 8. notifications (系統通知)

| 欄位 | 說明 | 備註 |
| :--- | :--- | :--- |
| id | 通知 ID (UUID) | PK |
| user_id | 接收者 ID | Index |
| type | 類型 (e.g. app_accepted) | |
| message | 通知內容 | |
| action_url | 點擊跳轉連結 | |
| related_id | 關聯資源 ID | |
| is_read | 是否已讀 | |
| created_at | 建立時間 | |
| updated_at | 更新時間 | |
| deleted_at | 軟刪除時間 | |

## 9. reports (檢舉系統)

| 欄位 | 說明 | 備註 |
| :--- | :--- | :--- |
| id | 檢舉 ID (UUID) | PK |
| reporter_id | 檢舉人 ID | |
| target_type | trip / user / review | |
| target_id | 檢舉對象 ID | |
| reason | 檢舉原因 | |
| status | pending / processed / dismissed | |
| admin_note | 管理員備註 | |
| created_at | 檢舉時間 | |
| updated_at | 更新時間 | |

## 10. site_feedbacks (平台建議)

| 欄位 | 說明 | 備註 |
| :--- | :--- | :--- |
| id | 評價 ID (UUID) | PK |
| user_id | 評價者 (可為 Null) | |
| contact_email | 聯絡電子信箱 | 用於匿名回饋跟進 |
| rating | 1-5 星 | |
| content | 建議內容 | |
| is_public | 是否公開 | |
| created_at | 建立時間 | |
| updated_at | 更新時間 | |
| deleted_at | 軟刪除時間 | |

## 11. categories (分類)

| 欄位 | 說明 | 備註 |
| :--- | :--- | :--- |
| id | 分類 ID (UUID) | PK |
| name | 名稱 | |
| icon | 圖示 | |
| sort_order | 排序 | |
| created_at | 建立時間 | |
| updated_at | 更新時間 | |
| deleted_at | 軟刪除時間 | |

---

## 📋 業務邏輯與公式 (Business Logic)

### A. 信任分數 (Trust Score) 公式

採加權計分，總分 100：

1. **身分驗證 (40%)**: Email 驗證 (+10), 手機驗證 (+30)。
2. **行程經驗 (30%)**: 每成功出團 1 次 (+5)，每成功參加並結束 1 次 (+2)，上限 30。
3. **社群回饋 (30%)**: `rating_average` * 6。
4. **扣分項**: 惡意棄單或違規被檢舉 (每次 -10)。

### B. 平均評分 (Rating Average)

計算該用戶作為「團主」收到所有 `reviews` 的平均值。

### C. 冗餘欄位說明 (Performance Tuning)

`trips_created`, `trips_joined`, `trips_completed` 等欄位雖然可以透過 SQL `COUNT` 動態算出來，但在顯示「推薦用戶」或「搜尋結果」列表時，如果每一筆都要即時遍歷數萬筆資料執行 `COUNT`，會產生嚴重的效能瓶頸。因此採取「寫入時更新，讀取時直接命中」的優化策略。

- **`trips_created`**: 當 `trips` 表新增一筆資料且 `owner_id` 為該用戶時 +1。
- **`trips_joined`**: 當 `applications` 狀態變更為 `accepted` (即正式加入成員名單) 時 +1。
- **`trips_completed`**: 當旅程 `status` 變更為 `completed` 時，該旅程的 `owner` 與所有 `members` 的此欄位皆 +1。

### D. 團主評分策略 (Host Rating Strategy)

採用 **兩階段呈現**：

1. **資料來源**：`trips.host_rating` 儲存旅程建立時的「快照值」。
2. **呈現邏輯**：前端顯示旅程詳情時，優先透過 `users.rating_average` 抓取該團主「目前的真實評分」，以確保資料即時性。

### E. 地圖與座標 (Google Maps)

- `meeting_point`：文字描述 (e.g. 台北車站東三門)，用於前端顯示。
- `location_lat`, `location_lng`：經緯度，用於精準導航。
- **開啟方式**：前端可直接導向 `https://www.google.com/maps/search/?api=1&query={lat},{lng}`。

### F. 行程圖示 (Itinerary Icons)

`type` 定義大類 (交通、活動、美食)，`icon` 儲存 Emoji。前端建議建立一個 Icon 選項清單（如：`type: food` 對應 `["🍱", "🍜", "☕"]`）供使用者選擇，不需另建資料表。
