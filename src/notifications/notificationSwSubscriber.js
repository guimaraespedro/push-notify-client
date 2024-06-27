export const subscribeToNotifications = (userId) => {
  Notification.requestPermission(registerServiceWorker(userId));
};

function registerServiceWorker(userId) {
  if ("serviceWorker" in navigator && Notification.permission === "granted") {
    navigator.serviceWorker
      .register("./firebase-messaging-sw.js")
      .then(async (serviceWorker) => {
        const subscription = await serviceWorker.pushManager.getSubscription();
        if (!subscription) {
          serviceWorker.pushManager.subscribe({
            applicationServerKey: process.env.REACT_APP_PUBLIC_KEY,
            userVisibleOnly: true,
          });
        }
      });
  }
}
