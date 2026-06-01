(function () {
  const PROFILES_KEY = "gym-profiles-v1";
  const ACTIVE_PROFILE_KEY = "gym-active-profile-v1";

  function emptyProfile(name) {
    return { name, exercises: [], workouts: [], measurements: [], goals: [] };
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
  state.exercises ||= [];
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

  /* ── Exercises API (catalogue par profil) ───────────────── */
  function getExercises() { return state.exercises; }

  function findExerciseById(id) { return state.exercises.find((e) => e.id === id); }

  function findExerciseByLabel(label) {
    if (!label) return null;
    return state.exercises.find((e) => e.label.toLowerCase() === label.toLowerCase());
  }

  function addExercise(label, type) {
    const id = `ex_${Date.now().toString(36)}`;
    state.exercises.push({ id, label: String(label).trim(), type: String(type) });
    saveProfiles();
    return id;
  }

  function editExercise(id, updates) {
    const ex = state.exercises.find((e) => e.id === id);
    if (!ex) return false;
    Object.assign(ex, updates);
    saveProfiles();
    return true;
  }

  function deleteExercise(id) {
    const before = state.exercises.length;
    state.exercises = state.exercises.filter((e) => e.id !== id);
    if (state.exercises.length !== before) {
      saveProfiles();
      return true;
    }
    return false;
  }

  function volume(workout) {
    const sets = Number(workout.sets || 0);
    const reps = Number(workout.reps || 0);
    const weight = Number(workout.weight || 0);
    const duration = Number(workout.duration || 0);
    if (weight > 0 && sets > 0 && reps > 0) return sets * reps * weight;
    if (sets > 0 && reps > 0) return sets * reps; // bodyweight-ish count
    if (duration > 0) return duration; // duration in minutes
    return 0;
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
    /* exercises API */
    getExercises,
    findExerciseById,
    findExerciseByLabel,
    addExercise,
    editExercise,
    deleteExercise,
  };
})();
