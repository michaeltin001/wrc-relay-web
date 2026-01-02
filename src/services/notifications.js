import { getMessaging, getToken, onMessage } from "firebase/messaging";

const messaging = getMessaging();

export const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      type: 'module',
      scope: '/firebase-cloud-messaging-push-scope',
    });

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    console.log("FCM Token:", token);
  }
};

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  alert(`New Request: ${payload.notification.body}`);
});
