const registrationUrl = new URL("../../sw.js", import.meta.url);
const notificationRoot = document.querySelector("#notification-container");

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(registrationUrl, {
        scope: new URL("../../", import.meta.url).pathname,
        updateViaCache: "none"
      });
      const showUpdate = (worker) => {
        if (!worker || worker.state !== "installed" || !navigator.serviceWorker.controller || !notificationRoot) return;
        let notice = notificationRoot.querySelector(".pwa-update");
        if (!notice) {
          notice = document.createElement("div");
          notice.className = "notification pwa-update";
          notice.setAttribute("role", "status");
          notice.innerHTML = '<span>Pembaruan aplikasi tersedia.</span><button type="button">Perbarui</button>';
          notificationRoot.append(notice);
          notice.querySelector("button").addEventListener("click", () => worker.postMessage({ type: "SKIP_WAITING" }));
        }
      };
      showUpdate(registration.waiting);
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => showUpdate(installing));
      });
      navigator.serviceWorker.addEventListener("controllerchange", () => window.location.reload());
      await registration.update();
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}
