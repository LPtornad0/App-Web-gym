(function () {
  function initNavigation() {
    const { $$ } = window.GymApp;

    $$(".bottom-nav button").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".bottom-nav button").forEach((navButton) => navButton.classList.remove("active"));
        button.classList.add("active");

        const targetId = button.dataset.target;
        $$(".view").forEach((view) => view.classList.toggle("active", view.id === targetId));

        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function initTheme() {
    const { $ } = window.GymApp;
    const { drawCharts } = window.GymCharts;

    let theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    $("#themeBtn").textContent = theme === "dark" ? "🌙" : "☀️";

    $("#themeBtn").addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", theme);
      $("#themeBtn").textContent = theme === "dark" ? "🌙" : "☀️";
      drawCharts();
    });
  }

  async function bootstrap() {
    const { loadPartials } = window.GymPartials;
    const { initForms } = window.GymForms;
    const { initPwa } = window.GymPwa;
    const { renderAll } = window.GymUI;

    await loadPartials();
    initNavigation();
    initTheme();
    initForms();
    /* Init exercise manager (if partial present) */
    if (window.GymForms && window.GymForms.initExerciseManager) window.GymForms.initExerciseManager();
    initPwa();
    renderAll();
  }

  bootstrap().catch((error) => {
    console.error(error);
    const app = document.querySelector(".app");
    if (app) {
      app.insertAdjacentHTML(
        "afterbegin",
        `<div class="card" style="margin:var(--space-4);border-color:var(--color-danger,#e74c3c);color:var(--color-danger,#e74c3c);">
          Impossible de charger les fragments HTML. Lance la page depuis un serveur local pour permettre aux requetes fetch de fonctionner.
        </div>`
      );
    }
  });
})();
