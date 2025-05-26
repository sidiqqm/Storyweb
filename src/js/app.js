import { initRouter } from "./routes.js";
import { registerServiceWorker } from "./utils/index.js";
import PushNotification from "./utils/pushNotification.js";
import "./utils/notification-helper.js";

document.addEventListener("DOMContentLoaded", async () => {
  await initRouter();
  await registerServiceWorker();

  console.log('Berhasil mendaftarkan service worker.');

  const pushNotification = new PushNotification();
  await pushNotification.renderPage();
})

