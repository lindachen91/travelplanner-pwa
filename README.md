# ✈️ 旅遊行程規劃

一個免費、開源的旅遊行程規劃工具，支援多人即時同步、Google Maps 連動、離線使用。

---

## ✨ 功能特色

- 📅 建立多個旅遊行程，支援日期區間選取
- 📍 每天新增活動，連動 Google Maps 導航
- ⭐ 每天設定本日重點
- 🔗 備註支援 `[文字](網址)` 超連結格式
- 👥 多人即時同步（透過 Supabase Realtime）
- 📱 支援 PWA，可加入手機主畫面離線使用
- 💾 離線時本機暫存，網路恢復後自動同步

---

## 🚀 快速開始

### 需要準備
- GitHub 帳號（免費）
- Supabase 帳號（免費）
- 約 15 分鐘

---

### Step 1｜Fork 此專案

點右上角 **「Fork」** 按鈕，複製到你自己的 GitHub 帳號。

---

### Step 2｜建立 Supabase 專案

1. 前往 [supabase.com](https://supabase.com) 用 Google 帳號登入
2. 點 **「New project」**
3. 填入：
   - Project name：`travel-planner`
   - Database Password：點 **「Generate a password」** 自動產生
   - Region：**Northeast Asia (Tokyo)**
4. 點 **「Create new project」**，等待約 1～2 分鐘

---

### Step 3｜建立資料表

進入 **SQL Editor → New query**，貼上以下程式碼，點 **「Run」** 執行：

```sql
create table if not exists shared_state (
  id text primary key,
  data text not null,
  updated_at timestamptz default now()
);

insert into shared_state (id, data, updated_at)
values ('main', '[]', now())
on conflict (id) do nothing;

alter table shared_state enable row level security;

create policy "anon read" on shared_state
  for select to anon using (true);

create policy "anon insert" on shared_state
  for insert to anon with check (true);

create policy "anon update" on shared_state
  for update to anon using (true);

grant select, insert, update on shared_state to anon;

alter publication supabase_realtime add table shared_state;
```

看到 **「Success」** 即完成 ✅

---

### Step 4｜取得連線資訊

**Project URL：**
- 進入 **Settings → General**
- 找到 **Reference ID**
- URL 格式：`https://你的ReferenceID.supabase.co`

**API Key：**
- 進入 **Settings → API Keys**
- 點 **「Legacy anon, service_role API keys」** 分頁
- 複製 **`anon`** 那行的金鑰

---

### Step 5｜填入連線資訊

用文字編輯器開啟 `index.html`，找到頂部這兩行：

```javascript
var SUPABASE_URL      = 'YOUR_SUPABASE_URL';
var SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

換成你的資訊：

```javascript
var SUPABASE_URL      = 'https://你的ReferenceID.supabase.co';
var SUPABASE_ANON_KEY = '你的anon金鑰';
```

存檔。

---

### Step 6｜部署到 GitHub Pages

1. 把修改好的 `index.html` 上傳到 repository
2. 進入 **Settings → Pages**
3. Branch 選 `main`，資料夾選 `/ (root)`，點 **Save**
4. 等待約 2 分鐘，取得網址：
   ```
   https://你的帳號.github.io/travel-planner/
   ```

---

### Step 7｜加入手機主畫面（選用）

用手機瀏覽器開啟網址：
- **iPhone（Safari）**：分享圖示 → 「加入主畫面」
- **Android（Chrome）**：右上角三點 → 「新增至主畫面」

加入後像 App 一樣啟動，支援離線使用 📱

---

## 📁 檔案說明

```
travel-planner/
├── index.html          # 主程式
├── manifest.json       # PWA 設定
├── sw.js               # Service Worker（離線快取）
├── icon-192.png        # App 圖示
├── icon-512.png        # App 圖示
├── apps-script.gs      # Google Sheets 同步腳本（選用）
└── README.md           # 說明文件
```

---

## 🔄 Google Sheets 同步（選用）

如果想從 Google Sheets 匯入行程，請參考 `apps-script.gs` 的設定說明。

Sheets 格式：

| 列 | A欄 | B欄起（每天佔4欄）|
|----|-----|-----------------|
| 1 | 行程名稱 | 關西之旅 |
| 2 | 目的地 | 大阪 |
| 3 | 開始時間 | 2026/12/20 |
| 4 | 結束時間 | 2026/12/25 |
| 5 | 天次 | 第一天 | 第二天 |
| 6 | 日期 | 12月20日 週日 | ... |
| 7 | 本日重點 | 大阪城 | ... |
| 8 | 行程標題 | 活動名稱 \| 類別 \| 地點 \| 備註 |
| 9起 | 7:00 | 活動內容（A欄請設為純文字格式）|

---

## 💡 使用說明

### 離線使用
- 有網路時：完整功能，即時同步
- 沒網路時：可瀏覽和編輯，恢復網路後自動同步
- 飛機上：可以看行程，降落後自動更新

### 多人共用
- 所有人開啟同一個網址
- 任何人的編輯都會即時同步給所有人
- 請只分享給信任的人

### 備份資料
- 進入說明頁 → 點「匯出資料」下載 JSON 備份
- 換裝置時可重新匯入

---

## ⚠️ 注意事項

**Supabase 免費方案限制：**
- 閒置超過 **7 天**會自動暫停
- 恢復方式：登入 Supabase → 點「Resume project」
- 資料不會遺失

**資料安全：**
- 知道網址的人都可以看到和編輯行程
- 請只分享給信任的人

---

## 🛠 技術架構

- **前端**：純 HTML / CSS / JavaScript
- **資料庫**：Supabase（PostgreSQL）
- **即時同步**：Supabase Realtime
- **離線快取**：PWA + Service Worker
- **部署**：GitHub Pages
- **試算表整合**：Google Sheets + Apps Script（選用）

---

## 📄 授權

MIT License — 自由使用、修改、分享。

---

*README 版本：2026.07*
