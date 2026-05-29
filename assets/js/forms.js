(function () {

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

    $("#exportBtn").addEventListener("click", exportData);
  }

  window.GymForms = { initForms };
})();
