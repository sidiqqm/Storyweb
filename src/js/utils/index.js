export function isServiceWorkerAvailable() {
  return "serviceWorker" in navigator;
}

export async function registerServiceWorker() {
  if (!isServiceWorkerAvailable()) {
    console.log("Service Worker API unsupported");
    return;
  }

  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register(
      "/sw.bundle.js"
    );

    console.log("Service Worker registered:", registration);

    // Saat versi baru tersedia dan sudah aktif
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      console.log("Controller changed, reloading once...");
      window.location.reload();
    });

    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      newWorker?.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          console.log("New SW waiting to activate");
          newWorker.postMessage({ type: "SKIP_WAITING" });
        }
      });
    });
  } catch (error) {
    console.error("Service worker registration failed:", error);
  }
}

export function convertBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function showFormattedDate(date, locale = "en-US", options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export async function createCarousel(containerElement, options = {}) {
  const { tns } = await import("tiny-slider");

  return tns({
    container: containerElement,
    mouseDrag: true,
    swipeAngle: false,
    speed: 600,

    nav: true,
    navPosition: "bottom",

    autoplay: false,
    controls: false,

    ...options,
  });
}
