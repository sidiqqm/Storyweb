import { generateNotificationNavbarTemplate } from "./templates.js";
import { isServiceWorkerAvailable } from "./index.js";
import { subscribe, getPushSubscription } from "./notification-helper.js";
import { requestNotificationPermission } from "./notification-helper.js";

export default class PushNotification {
  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById(
      "push-notification-tools"
    );
    if (!pushNotificationTools) {
      console.error("Element #push-notification-tools tidak ditemukan");
      return;
    }

    pushNotificationTools.innerHTML = generateNotificationNavbarTemplate();

    const subscribeButton = document.getElementById("subscribe-button");
    const unsubscribeButton = document.getElementById("unsubscribe-button");

    if (subscribeButton) {
      subscribeButton.addEventListener("click", async () => {
        const granted = await requestNotificationPermission();
        if (!granted) {
          console.log("Pengguna tidak memberikan izin notifikasi.");
          return;
        }

        try {
          await subscribe();
          console.log("Berhasil berlangganan notifikasi");
        } catch (error) {
          console.error("Gagal berlangganan notifikasi:", error);
        }
      });
    }

    if (unsubscribeButton) {
      unsubscribeButton.addEventListener("click", async () => {
        try {
          const subscription = await getPushSubscription();
          if (subscription) {
            await subscription.unsubscribe();
            alert("Notifikasi berhasil dibatalkan.");
          } else {
            alert("Kamu belum berlangganan notifikasi.");
          }
        } catch (error) {
          console.error("Gagal membatalkan notifikasi:", error);
        }
      });
    }

    const notifyButton = document.getElementById("notify-button");
    if (notifyButton) {
      notifyButton.addEventListener("click", async () => {
        if (!("serviceWorker" in navigator)) {
          console.error("Service Worker tidak tersedia");
          return;
        }

        const registration = await navigator.serviceWorker.ready;

        registration.active.postMessage({
          type: "TEST_PUSH",
          payload: {
            title: "Notifikasi Lokal",
            body: "Ini adalah notifikasi dari tombol Notify Me",
            url: "/",
          },
        });
      });
    }
  }

  #setupNavigationList() {
    console.log("Setup navigasi selesai");
  }

  async renderPage() {
    if (typeof transition === "undefined") {
      console.warn("transition tidak tersedia. Melewati animasi halaman.");
      this.#setupNavigationList();
      if (isServiceWorkerAvailable()) {
        await this.#setupPushNotification();
      }
      return;
    }

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(async () => {
      scrollTo({ top: 0, behavior: "instant" });
      this.#setupNavigationList();

      if (isServiceWorkerAvailable()) {
        await this.#setupPushNotification();
      }
    });
  }
}
