(function () {
  function renderKPIs() {
    const { state, $, volume } = window.GymApp;

    $("#kpiWorkouts").textContent = state.workouts.length;
    $("#kpiVolume").textContent = `${Math.round(state.workouts.reduce((sum, workout) => sum + volume(workout), 0))} kg`;

    const latestMeasurement = [...state.measurements].sort((a, b) => b.date.localeCompare(a.date))[0];
    $("#kpiWeight").textContent = latestMeasurement ? `${latestMeasurement.weight} kg` : "-";

    const goalsCompletion = state.goals.length
      ? Math.round(
          state.goals.reduce((sum, goal) => sum + Math.min((goal.current / goal.target) * 100, 100), 0) / state.goals.length,
        )
      : 0;

    $("#kpiGoals").textContent = `${goalsCompletion}%`;
  }

  function renderRecent() {
    const { state, $, volume } = window.GymApp;
    const rows = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

    $("#recentWorkouts").innerHTML = rows.length
      ? rows
          .map(
            (workout) =>
              `<div class="mini"><strong>${workout.exercise}</strong><span class="muted">${workout.date} · ${workout.name}</span><div class="muted">${workout.sets} x ${workout.reps} a ${workout.weight} kg · ${Math.round(volume(workout))} kg volume</div></div>`,
          )
          .join("")
      : '<div class="empty">Ajoute une seance pour commencer.</div>';
  }

  function renderWorkoutList() {
    const { state, $, volume } = window.GymApp;
    const rows = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date));

    $("#workoutList").innerHTML = rows.length
      ? rows
          .map(
            (workout) =>
              `<div class="mini"><strong>${workout.exercise}</strong><span class="muted">${workout.date} · ${workout.name}</span><div>${workout.sets} x ${workout.reps} a ${workout.weight} kg</div><div class="muted">Volume ${Math.round(volume(workout))} kg</div>${workout.notes ? `<div class="muted">${workout.notes}</div>` : ""}</div>`,
          )
          .join("")
      : '<div class="empty">Aucune seance enregistree.</div>';
  }

  function renderMeasurementList() {
    const { state, $ } = window.GymApp;
    const rows = [...state.measurements].sort((a, b) => b.date.localeCompare(a.date));

    $("#measurementList").innerHTML = rows.length
      ? rows
          .map(
            (measurement) =>
              `<div class="mini"><strong>${measurement.weight} kg</strong><span class="muted">${measurement.date}</span><div class="muted">MG ${measurement.bodyFat || "-"}% · Taille ${measurement.waist || "-"} cm · Bras ${measurement.arm || "-"} cm · Cuisse ${measurement.thigh || "-"} cm</div></div>`,
          )
          .join("")
      : '<div class="empty">Aucune mensuration enregistree.</div>';
  }

  function renderGoals() {
    const { state, $ } = window.GymApp;

    $("#goalList").innerHTML = state.goals.length
      ? state.goals
          .map((goal) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            return `<div class="mini"><strong>${goal.label}</strong><span class="muted">${goal.type}</span><div class="progress"><span style="width:${progress}%"></span></div><div class="muted" style="margin-top:.45rem">${goal.current} / ${goal.target} · ${Math.round(progress)}%</div></div>`;
          })
          .join("")
      : '<div class="empty">Aucun objectif defini.</div>';
  }

  function renderAll() {
    const { save } = window.GymApp;
    const { drawCharts } = window.GymCharts;

    renderKPIs();
    renderRecent();
    renderWorkoutList();
    renderMeasurementList();
    renderGoals();
    drawCharts();
    save();
  }

  window.GymUI = {
    renderKPIs,
    renderRecent,
    renderWorkoutList,
    renderMeasurementList,
    renderGoals,
    renderAll,
  };
})();
