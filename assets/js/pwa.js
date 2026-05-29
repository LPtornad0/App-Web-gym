(function () {
  function initPwa() {
    const { $ } = window.GymApp;
    let deferredPrompt = null;

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredPrompt = event;
      $("#installBtn").classList.add("show");
    });

    $("#installBtn").addEventListener("click", async () => {
      if (!deferredPrompt) {
        alert("Sur certains mobiles, utilise 'Ajouter a l'ecran d'accueil' depuis le navigateur.");
        return;
      }

      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      $("#installBtn").classList.remove("show");
    });

    const manifest = {
      name: "Gym Progress Mobile",
      short_name: "Gym Progress",
      start_url: "./gym-progress-mobile.html",
      display: "standalone",
      background_color: "#171614",
      theme_color: "#171614",
      icons: [
        {
          src:
            "data:image/svg+xml;base64," +
            btoa(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#171614"/><rect x="12" y="28" width="10" height="8" rx="2" fill="#4f98a3"/><rect x="42" y="28" width="10" height="8" rx="2" fill="#4f98a3"/><rect x="22" y="29" width="20" height="6" rx="3" fill="#4f98a3"/><path d="M24 21L32 14L40 21" stroke="#f1ece6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            ),
          sizes: "192x192",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
      ],
    };

    const manifestBlob = new Blob([JSON.stringify(manifest)], { type: "application/json" });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = manifestUrl;
    document.head.appendChild(link);

    if ("serviceWorker" in navigator) {
      const swCode =
        "self.addEventListener('install', () => self.skipWaiting());self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));self.addEventListener('fetch', () => {});";
      const swBlob = new Blob([swCode], { type: "text/javascript" });
      navigator.serviceWorker.register(URL.createObjectURL(swBlob)).catch(() => {});
    }
  }

  window.GymPwa = { initPwa };
})();
