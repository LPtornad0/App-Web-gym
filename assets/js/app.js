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

  function bootstrap() {
    const { initForms } = window.GymForms;
    const { initPwa } = window.GymPwa;
    const { renderAll } = window.GymUI;

    initNavigation();
    initTheme();
    initForms();
    initPwa();
    renderAll();
  }

  bootstrap();
})();
