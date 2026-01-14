├── backend/                # Mock 後端伺服器
│   ├── db.json             # 存放所有旅程、會員、心得資料的資料庫
│   ├── public/             # (選填) 存放 json-server 需要的圖片資源
│   └── package.json        # (建議) 獨立管理 backend 啟動腳本
├── docs/                   # 您目前的線稿、使用者故事等文件 (保持不變)
├── public/                 # 前端靜態資源 (Vite)
├── src/                    # React 前端程式碼
│   ├── api/                # 【新增】管理 axios 與 json-server 請求
│   │   ├── axiosInstance.js # 設定 Base URL (e.g., http://localhost:3001)
│   │   ├── tripApi.js      # 旅程相關請求 (GET /trips, POST /trips)
│   │   └── userApi.js      # 會員相關請求 (GET /users, PATCH /users)
│   ├── assets/             # 圖片、圖標
│   ├── components/         # 共用組件 (Navbar, Footer, Card)
│   ├── pages/              # 頁面組件 (Home, Explore, Member...)
│   ├── routes/             # 路由配置 (React Router)
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── package.json            # 前端專案依賴與腳本
├── vite.config.js          # Vite 配置 (建議在此設定 Proxy)
└── README.md