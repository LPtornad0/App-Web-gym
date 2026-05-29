(function () {
  const PROFILES_KEY = "gym-profiles-v1";
  const ACTIVE_PROFILE_KEY = "gym-active-profile-v1";

  function emptyProfile(name) {
    return { name, workouts: [], measurements: [], goals: [] };
  }

  function loadProfiles() {
    try {
      const data = JSON.parse(localStorage.getItem(PROFILES_KEY) || "null");
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {}
    return [emptyProfile("Profil 1")];
  }

  function saveProfiles() {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  }

  let profiles = loadProfiles();
  let activeIndex = parseInt(localStorage.getItem(ACTIVE_PROFILE_KEY) || "0", 10);
  if (activeIndex >= profiles.length) activeIndex = 0;

  const state = profiles[activeIndex];
  state.workouts ||= [];
  state.measurements ||= [];
  state.goals ||= [];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const today = new Date().toISOString().slice(0, 10);

  function save() {
    profiles[activeIndex] = state;
    saveProfiles();
  }

  function getActiveIndex() { return activeIndex; }

  function setActiveProfile(index) {
    if (index < 0 || index >= profiles.length) return;
    profiles[activeIndex] = Object.assign({}, state);
    saveProfiles();
    activeIndex = index;
    localStorage.setItem(ACTIVE_PROFILE_KEY, String(index));
    const newProfile = profiles[activeIndex];
    state.name = newProfile.name;
    state.workouts = newProfile.workouts || [];
    state.measurements = newProfile.measurements || [];
    state.goals = newProfile.goals || [];
  }

  function addProfile(name) {
    profiles.push(emptyProfile(name));
    saveProfiles();
  }

  function deleteProfile(index) {
    if (profiles.length <= 1) return;
    profiles.splice(index, 1);
    if (activeIndex >= profiles.length) activeIndex = profiles.length - 1;
    localStorage.setItem(ACTIVE_PROFILE_KEY, String(activeIndex));
    const p = profiles[activeIndex];
    state.name = p.name;
    state.workouts = p.workouts || [];
    state.measurements = p.measurements || [];
    state.goals = p.goals || [];
    saveProfiles();
  }

  function renameProfile(index, name) {
    if (!profiles[index]) return;
    profiles[index].name = name;
    if (index === activeIndex) state.name = name;
    saveProfiles();
  }

  function getProfiles() { return profiles; }

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
    PROFILES_KEY,
    state,
    $,
    $$,
    today,
    save,
    volume,
    chartColors,
    getProfiles,
    getActiveIndex,
    setActiveProfile,
    addProfile,
    deleteProfile,
    renameProfile,
  };
})();
