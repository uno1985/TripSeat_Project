# 🍊 tripSeat - 揪團旅遊 Social Trip Platform

![tripSeat Logo](https://api.dicebear.com/7.x/shapes/svg?seed=tripSeat&backgroundColor=fbb03b)

**tripSeat** 是一個專為「揪團旅遊」設計的社群平台。透過簡約現代的設計與強大的信任機制，讓志同道合的旅伴能夠輕鬆相遇、安心出遊。

## 🚀 技術棧 (Tech Stack)

- **前端 (Frontend)**: React (Vite) + Bootstrap 5
- **模擬後端 (Backend)**: json-server + json-server-auth (JWT Ready)
- **設計風格**: 橘黃色系、簡約插畫、Google Fonts (Inter/Roboto)

## 📂 專案結構 (Directory Structure)

```text
tripSeat/
├── backend/            # 模擬數據中心 (db.json)
├── docs/               # Project Planning & Tech Docs
│   ├── 01-requirements-analysis.md
│   ├── 02-roadmap.md
│   ├── 03-sitemap.md
│   ├── 03-sitemap-feedback.md
│   ├── 04-ui-ux-design-guide.md
│   ├── 05-database-schema.md
│   └── 06-backend-guide.md
├── public/             # 靜態資源 (圖片、Logo)
└── src/                # [開發中] React 原始碼
```


## Git 規範

> 本專案採用「feature → dev → main」流程，  
> feature 為一次性分支，合併完成後即刪除。


### 分支說明

| 分支           | 說明                                           |
| -------------- | ---------------------------------------------- |
| `main`         | **主線**，穩定可執行版本（僅專案負責人可合併） |
| `dev`          | **整合驗證支線**，合併前測試用                 |
| `feature/uno`  | UNO 個人開發支線                               |
| `feature/gwen` | Gwen 個人開發支線                              |
| `feature/cami` | Cami 個人開發支線                              |
| `feature/tou`  | Tou 個人開發支線                               |

---

### 分支使用原則

- 所有開發一律在自己的 `feature/*` 分支進行  
- 禁止直接在 `main`、`dev` 分支上進行開發  
- 合併至主線一律使用 `--no-ff`  
- `main` 分支僅由專案主持人執行合併  

---

## GITHUB 基本操作流程

### 1️⃣ 開發前（確認主線狀態）
```bash
git checkout main
git pull origin main
```
說明：本步驟僅供了解主線狀態，實際開發請以 dev 為基準。

### 2️⃣ 合併完當週，首次開發請重新開設新分支
```bash
git checkout dev
git pull origin dev
git branch -d feature/uno #首次建立無須執行，主要後續重置時使用
git checkout -b feature/uno
git push -u origin feature/uno
```
**uno為舉例用，請依照分支說明用自己的名字填寫**

切到 dev
同步最新 dev
刪除本機個人支線
建立新的個人支線
推到 GitHub，讓整合者看得到
:::info
注意事項：
每週首次建立個人分支時，必須執行一次
git push -u origin feature/*    以設定 upstream。
後續在該分支上更新程式碼，可直接使用 git push 推送。
:::

### 3️⃣ 個人支線日常開發推送
```bash
git push origin feature/uno
```

### 每周由專案主持人合併支線
> 以下流程僅限專案主持人執行，組員請勿自行合併。
```bash
git fetch origin
git checkout dev
git pull origin dev
git merge --no-ff origin/feature/gwen
git merge --no-ff origin/feature/uno
git merge --no-ff origin/feature/tou
git merge --no-ff origin/feature/cami
git push origin dev
git checkout main
git pull origin main
git merge --no-ff dev
git push origin main
```
**同步完成後至Github 手動刪除feature分支**

### 常用git指令說明
|指令|說明|
|---|---|
|``` git init ```|創建環境|
|``` git add . ```|加入追蹤|
|``` git commit -m "說明這次做了什麼"  ```|提交|
|``` git push -u origin branch-name  ```|首次推送至GitHub|
|``` git push ```|後續於該分支推送|
|``` git checkout -b branch-name  ```| 建立並切換分支|
|``` git checkout branch-name  ```|切換到該分支|
|``` git branch -d branch-name  ```|刪除本機分支|
|``` git reset  ```|退回暫存區（staged）狀態，不會刪檔案內容|
|``` git checkout .  ```|放棄所有尚未 commit 的變更|
|``` git pull origin branch-name  ```|下載同步目前分支(會動檔案)|
|``` git fetch origin  ```|下載遠端資訊（不會動檔案）|
|``` git status  ```|查看目前分支狀態|
|``` git branch  ```|有 * 的是目前所在分支|
|``` git branch -r  ```|查看遠端分支|
|``` git merge --no-ff origin/branch-name  ```|合併分支（保留紀錄）|
|``` git merge --abort  ```|中止正在進行的 merge|

**branch-name 請更換為分支**



## 專案初始化（首次下載完後務必執行安裝）

### 安裝相依套件
```bash
npm install
```

- 讀取 package.json
- 依照 package-lock.json
- 自動產生 node_modules

### 啟動開發環境
```bash
npm run dev
```
- 啟動本地開發伺服器
- 依照終端機提示開啟瀏覽器即可進行開發
  
### Build 專案
```bash
npm run build
```
- 啟動本地開發伺服器
- 依照終端機提示開啟瀏覽器即可進行開發
  
### deploy git
```bash
npm run deploy
```
- 此指令僅用於將 build 後的成品 部署至 GitHub Pages（gh-pages 分支）
- 僅限專案管理人於 main 更新前或發佈時執行
- 一般開發成員 不得 使用此指令
- 注意：npm run deploy 只會更新 gh-pages，不會影響 main 或 dev。

## 🛠️ Getting Started

Please refer to [06-backend-guide.md](docs/06-backend-guide.md) to start the Mock API.

---
*最後更新日2026/01/08 UNO*
