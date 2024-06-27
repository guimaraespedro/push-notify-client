self.addEventListener("push", async (event) => {
  if (Notification.permission === "granted") {
    const payload = await event.data.json();
    event.waitUntil(
      self.registration.showNotification(
        payload.notification.title,
        payload.notification
      )
    );
  }
});
