(function () {
  const STORAGE_KEY = "gym-progress-mobile-v1";
  const fallbackState = { workouts: [], measurements: [], goals: [] };

  let parsed;
  try {
    parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    parsed = null;
  }

  const state = parsed && typeof parsed === "object" ? parsed : fallbackState;
  state.workouts ||= [];
  state.measurements ||= [];
  state.goals ||= [];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const today = new Date().toISOString().slice(0, 10);

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function volume(workout) {
    return Number(workout.sets) * Number(workout.reps) * Number(workout.weight);
  }

  function chartColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      text: styles.getPropertyValue("--color-text").trim(),
      muted: styles.getPropertyValue("--color-text-muted").trim(),
      primary: styles.getPropertyValue("--color-primary").trim(),
      blue: styles.getPropertyValue("--color-blue").trim(),
      grid: "rgba(127,127,127,.16)",
    };
  }

  window.GymApp = {
    STORAGE_KEY,
    state,
    $,
    $$,
    today,
    save,
    volume,
    chartColors,
  };
})();
