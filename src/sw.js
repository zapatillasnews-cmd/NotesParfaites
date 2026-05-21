import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

// Map of reminder id → setTimeout timer id
const timers = new Map();

self.addEventListener('message', event => {
  const { type, payload } = event.data || {};

  if (type === 'SCHEDULE') {
    const { id, title, delay } = payload;
    // Cancel any existing timer for this reminder
    if (timers.has(id)) clearTimeout(timers.get(id));

    const fire = () => {
      self.registration.showNotification(title || 'NotesParfaites', {
        body: 'Rappel — NotesParfaites',
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [200, 100, 200],
        tag: String(id),
      });
      timers.delete(id);
    };

    if (delay <= 0) {
      fire();
    } else {
      timers.set(id, setTimeout(fire, delay));
    }
  }

  if (type === 'CANCEL') {
    const { id } = payload || {};
    if (id !== undefined && timers.has(id)) {
      clearTimeout(timers.get(id));
      timers.delete(id);
    }
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
