# 🗄️ Supabase 設定說明書
### 旅遊行程規劃 · 資料庫設定指南

---

## 📋 開始之前

你需要準備：
- 一個 Google 帳號（用來登入 Supabase）
- 約 10 分鐘的時間

---

## Step 1｜建立 Supabase 帳號

1. 開啟瀏覽器，前往 👉 [https://supabase.com](https://supabase.com)
2. 點右上角 **「Start your project」**
3. 選擇 **「Continue with Google」**，用 Google 帳號登入
4. 登入完成後進入 Supabase 控制台

---

## Step 2｜建立新專案

1. 點左上角 **「New project」**

2. 填入以下資訊：

   | 欄位 | 填入內容 |
   |------|---------|
   | Project name | `travel-planner`（或任意名稱） |
   | Database Password | 點 **「Generate a password」** 自動產生即可 |
   | Region | 選 **Northeast Asia (Tokyo)** |

3. 點 **「Create new project」**

4. ⏳ 等待約 **1～2 分鐘**，看到綠色 Ready 表示建立完成

---

## Step 3｜建立資料表

1. 點左側選單的 **「SQL Editor」**

2. 點右上角 **「＋ New query」**

3. 將以下程式碼**全部複製**，貼入編輯區：

```sql
-- 建立資料表
create table if not exists shared_state (
  id text primary key,
  data text not null,
  updated_at timestamptz default now()
);

-- 插入初始資料
insert into shared_state (id, data, updated_at)
values ('main', '[]', now())
on conflict (id) do nothing;

-- 開啟安全性設定
alter table shared_state enable row level security;

-- 設定公開讀取權限
create policy "anon read" on shared_state
  for select to anon using (true);

-- 設定公開新增權限
create policy "anon insert" on shared_state
  for insert to anon with check (true);

-- 設定公開修改權限
create policy "anon update" on shared_state
  for update to anon using (true);

-- 給予 anon 角色完整權限
grant select, insert, update on shared_state to anon;

-- 開啟即時同步功能
alter publication supabase_realtime add table shared_state;
```

4. 點右上角 **「Run」** 執行

5. 看到 **「Success. No rows returned」** 表示成功 ✅

   > ⚠️ 如果出現錯誤訊息 `already exists`，表示之前已建立過，可以忽略，繼續下一步

---

## Step 4｜取得連線資訊

### 取得 Project URL

1. 點左側選單最下方 **「Settings」**（齒輪圖示）
2. 點 **「General」**
3. 找到 **「Reference ID」**，複製這串英文字母
4. 你的 URL 格式為：
   ```
   https://你的ReferenceID.supabase.co
   ```
   例如：`https://abcdefghij.supabase.co`

### 取得 API Key

1. 點左側 **「Settings」→「API Keys」**
2. 點上方第二個分頁 **「Legacy anon, service_role API keys」**
3. 找到 **`anon`** 那行
4. 點右邊的 **複製圖示** 📋 複製這串很長的金鑰

   > ⚠️ 注意：複製 `anon` 那行，不是 `service_role`

---

## Step 5｜填入網頁程式碼

1. 用文字編輯器開啟 `index.html`
   - Windows：記事本、Notepad++
   - Mac：TextEdit、VSCode

2. 按 **Ctrl+F**（Mac 用 **Cmd+F**）搜尋：
   ```
   YOUR_SUPABASE_URL
   ```

3. 找到這兩行：
   ```javascript
   var SUPABASE_URL      = 'YOUR_SUPABASE_URL';
   var SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

4. 換成你自己的資訊：
   ```javascript
   var SUPABASE_URL      = 'https://你的ReferenceID.supabase.co';
   var SUPABASE_ANON_KEY = '貼上你複製的anon金鑰';
   ```

5. 存檔

---

## Step 6｜上傳到 GitHub Pages

1. 開啟你的 GitHub repository
2. 點 **「Add file」→「Upload files」**
3. 上傳修改好的 `index.html`
4. 點 **「Commit changes」**
5. 等待約 **2 分鐘**後，開啟你的網址測試

---

## ✅ 測試是否成功

開啟網頁後，看 nav bar 右側：

| 顯示 | 代表 |
|------|------|
| 🟢 已同步 | 設定成功！ |
| 🔴 同步失敗 | 請回頭確認 Step 3～5 |
| ⚫ 本機模式 | URL 或 Key 填錯了 |

---

## ❓ 常見問題

**Q：Supabase 要付費嗎？**
A：免費方案完全夠用，每月有 500MB 儲存空間、50,000 次 API 請求。

**Q：免費方案會暫停嗎？**
A：閒置超過 7 天會自動暫停，重新登入 Supabase 點「Resume project」即可恢復，資料不會遺失。

**Q：可以多人同時編輯嗎？**
A：可以！開啟同一個網址，任何人的修改都會即時同步給所有人。

**Q：資料安全嗎？**
A：資料存在 Supabase 的雲端資料庫，有基本的安全設定。但這是共用連結，知道網址的人都可以看到和編輯，請只分享給信任的人。

---

## 📞 需要幫助？

如果設定過程中遇到問題，可以截圖錯誤訊息詢問。

---

*說明書版本：2026.07 · 旅遊行程規劃*
