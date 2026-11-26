const registrationUrl = new URL("../../sw.js", import.meta.url);
const updateBar = document.createElement("div");
updateBar.setAttribute("role", "status");
updateBar.hidden = true;
updateBar.style.cssText = "position:fixed;z-index:1000;inset:auto 16px 16px;display:flex;gap:12px;align-items:center;justify-content:space-between;padding:12px 16px;border:1px solid #3b4a52;border-radius:12px;background:#202c33;color:#e9edef;font:14px system-ui;box-shadow:0 8px 30px #0005";
updateBar.innerHTML = '<span>Pembaruan aplikasi tersedia.</span><button type="button" style="border:0;border-radius:8px;padding:8px 12px;background:#25d366;color:#111b21;font-weight:700;cursor:pointer">Perbarui</button>';
document.body.append(updateBar);

let waitingWorker = null;
updateBar.querySelector("button").addEventListener("click", () => {
  waitingWorker?.postMessage({ type: "SKIP_WAITING" });
});

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(registrationUrl, {
        scope: new URL("../../", import.meta.url).pathname,
        updateViaCache: "none"
      });

      const showUpdate = (worker) => {
        if (!worker || worker.state !== "installed" || !navigator.serviceWorker.controller) return;
        waitingWorker = worker;
        updateBar.hidden = false;
      };

      showUpdate(registration.waiting);
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => showUpdate(installing));
      });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (waitingWorker) window.location.reload();
      });

      // Ask the browser to check for an updated worker on each app load.
      await registration.update();
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  });
}
