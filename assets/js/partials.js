(function () {
  const fragmentMap = {
    dashboard: "./assets/html/partials/dashboard.html",
    workouts: "./assets/html/partials/workouts.html",
    measurements: "./assets/html/partials/measurements.html",
    goals: "./assets/html/partials/goals.html",
    settings: "./assets/html/partials/settings.html",
    exercises: "./assets/html/partials/exercises.html",
  };

  async function loadPartials() {
    const targets = document.querySelectorAll("[data-fragment]");

    await Promise.all(Array.from(targets).map(async (target) => {
      const fragmentName = target.dataset.fragment;
      const fragmentUrl = fragmentMap[fragmentName];

      if (!fragmentUrl) {
        return;
      }

      const response = await fetch(fragmentUrl, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Impossible de charger ${fragmentUrl} (${response.status})`);
      }

      target.innerHTML = await response.text();
    }));
  }

  window.GymPartials = {
    loadPartials,
  };
})();