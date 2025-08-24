self.addEventListener('install', (event) => {
  self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); 
});

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push recibido');

  if (!event.data) {
    console.warn('[Service Worker] Push sin datos');
    return;
  }

  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    console.error('[Service Worker] Error parseando JSON del push', e);
    return;
  }

  const title = data.title || 'Notificación';
  const options = {
    body: data.body || 'Sin cuerpo',
    icon: data.icon || '/icon.png',
    badge: data.badge || '/badge.png',
    vibrate: data.vibrate || [100, 50, 100],
    data: data.data || {},
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url;
  if (urlToOpen) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        for (const client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

self.addEventListener('message', (event) => {
  console.warn('[Service Worker] Mensaje recibido', event.data);
});
