(function () {
  function seedExampleData() {
    const { state } = window.GymApp;
    const { renderAll } = window.GymUI;

    state.workouts = [
      { date: "2026-05-04", name: "Push", exercise: "Developpe couche", sets: 4, reps: 8, weight: 60, notes: "Propre" },
      { date: "2026-05-10", name: "Legs", exercise: "Squat", sets: 4, reps: 6, weight: 85, notes: "" },
      { date: "2026-05-16", name: "Pull", exercise: "Rowing barre", sets: 4, reps: 10, weight: 55, notes: "" },
      { date: "2026-05-24", name: "Push", exercise: "Developpe couche", sets: 4, reps: 8, weight: 62.5, notes: "+2.5kg" },
    ];

    state.measurements = [
      { date: "2026-05-01", weight: 74.8, bodyFat: 16.2, waist: 82, arm: 35, thigh: 56 },
      { date: "2026-05-15", weight: 75.5, bodyFat: 15.7, waist: 81.6, arm: 35.4, thigh: 56.5 },
      { date: "2026-05-28", weight: 76.1, bodyFat: 15.4, waist: 81, arm: 35.9, thigh: 57 },
    ];

    state.goals = [
      { type: "Exercice", label: "Bench 80 kg", target: 80, current: 62.5 },
      { type: "Poids du corps", label: "Atteindre 78 kg", target: 78, current: 76.1 },
    ];

    renderAll();
  }

  function exportData() {
    const { state } = window.GymApp;

    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "gym-progress-mobile-data.json";
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  function initForms() {
    const { state, $, today } = window.GymApp;
    const { renderAll } = window.GymUI;

    const workoutDateInput = $("#workoutDate");
    const workoutNameInput = $("#workoutName");
    const exerciseNameInput = $("#exerciseName");
    const setsInput = $("#sets");
    const repsInput = $("#reps");
    const weightInput = $("#weight");
    const notesInput = $("#notes");

    const measureDateInput = $("#measureDate");
    const bodyWeightInput = $("#bodyWeight");
    const bodyFatInput = $("#bodyFat");
    const waistInput = $("#waist");
    const armInput = $("#arm");
    const thighInput = $("#thigh");

    const goalTypeInput = $("#goalType");
    const goalLabelInput = $("#goalLabel");
    const goalTargetInput = $("#goalTarget");
    const goalCurrentInput = $("#goalCurrent");

    workoutDateInput.value = today;
    measureDateInput.value = today;

    $("#workoutForm").addEventListener("submit", (event) => {
      event.preventDefault();

      state.workouts.push({
        date: workoutDateInput.value,
        name: workoutNameInput.value.trim(),
        exercise: exerciseNameInput.value.trim(),
        sets: Number(setsInput.value),
        reps: Number(repsInput.value),
        weight: Number(weightInput.value),
        notes: notesInput.value.trim(),
      });

      event.target.reset();
      workoutDateInput.value = today;
      setsInput.value = 4;
      repsInput.value = 8;
      weightInput.value = 40;
      renderAll();
    });

    $("#measurementForm").addEventListener("submit", (event) => {
      event.preventDefault();

      state.measurements.push({
        date: measureDateInput.value,
        weight: Number(bodyWeightInput.value),
        bodyFat: bodyFatInput.value ? Number(bodyFatInput.value) : "",
        waist: waistInput.value ? Number(waistInput.value) : "",
        arm: armInput.value ? Number(armInput.value) : "",
        thigh: thighInput.value ? Number(thighInput.value) : "",
      });

      event.target.reset();
      measureDateInput.value = today;
      renderAll();
    });

    $("#goalForm").addEventListener("submit", (event) => {
      event.preventDefault();

      state.goals.push({
        type: goalTypeInput.value,
        label: goalLabelInput.value.trim(),
        target: Number(goalTargetInput.value),
        current: Number(goalCurrentInput.value),
      });

      event.target.reset();
      renderAll();
    });

    $("#seedBtn").addEventListener("click", seedExampleData);
    $("#exportBtn").addEventListener("click", exportData);
  }

  window.GymForms = { initForms };
})();
