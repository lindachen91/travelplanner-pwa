const CACHE_NAME = 'travel-planner-v1';
const OFFLINE_URLS = [
  '/travel-planner/',
  '/travel-planner/index.html',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// ── 安裝：快取核心資源 ──
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/travel-planner/',
        '/travel-planner/index.html'
      ]);
    })
  );
  self.skipWaiting();
});

// ── 啟用：清除舊快取 ──
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// ── 攔截請求：網路優先，失敗用快取 ──
self.addEventListener('fetch', function(e) {
  // Supabase API 請求：只走網路，不快取
  if (e.request.url.includes('supabase.co')) {
    return;
  }

  // 其他請求：網路優先，離線時用快取
  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        // 成功取得網路資源，更新快取
        if (response && response.status === 200 && e.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      })
      .catch(function() {
        // 網路失敗，從快取取
        return caches.match(e.request).then(function(cached) {
          if (cached) return cached;
          // 完全離線時回傳主頁
          return caches.match('/travel-planner/index.html');
        });
      })
  );
});

// ── 背景同步（網路恢復時自動同步）──
self.addEventListener('sync', function(e) {
  if (e.tag === 'sync-trips') {
    // 通知頁面重新同步
    self.clients.matchAll().then(function(clients) {
      clients.forEach(function(client) {
        client.postMessage({ type: 'SYNC_NOW' });
      });
    });
  }
});
