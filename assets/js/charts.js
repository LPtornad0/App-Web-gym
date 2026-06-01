(function () {
  let volumeChart;
  let weightChart;
  let exerciseChart;

  function drawCharts() {
    const { state, $, volume, chartColors } = window.GymApp;
    const colors = chartColors();

    const workouts = [...state.workouts].sort((a, b) => a.date.localeCompare(b.date));
    const measurements = [...state.measurements].sort((a, b) => a.date.localeCompare(b.date));

    if (volumeChart) {
      volumeChart.destroy();
    }

    volumeChart = new Chart($("#volumeChart"), {
      type: "line",
      data: {
        labels: workouts.map((workout) => workout.date.slice(5)),
        datasets: [
          {
            label: "Volume",
            data: workouts.map(volume),
            borderColor: colors.primary,
            backgroundColor: "rgba(79,152,163,.18)",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: { color: colors.text },
          },
        },
        scales: {
          x: {
            ticks: { color: colors.muted },
            grid: { color: colors.grid },
          },
          y: {
            ticks: { color: colors.muted },
            grid: { color: colors.grid },
          },
        },
      },
    });

    if (weightChart) {
      weightChart.destroy();
    }

    weightChart = new Chart($("#weightChart"), {
      type: "bar",
      data: {
        labels: measurements.map((measurement) => measurement.date.slice(5)),
        datasets: [
          {
            label: "Poids",
            data: measurements.map((measurement) => measurement.weight),
            backgroundColor: colors.blue,
            borderRadius: 8,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: { color: colors.text },
          },
        },
        scales: {
          x: {
            ticks: { color: colors.muted },
            grid: { color: colors.grid },
          },
          y: {
            ticks: { color: colors.muted },
            grid: { color: colors.grid },
          },
        },
      },
    });
  }

  

  /* Draw chart for a specific exercise (by id) */
  function drawExerciseChart(exerciseId) {
    const { state, chartColors } = window.GymApp;
    const colors = chartColors();
    const ex = window.GymApp.findExerciseById(exerciseId);
    const workouts = [...state.workouts].filter((w) => w.exerciseId === exerciseId).sort((a, b) => a.date.localeCompare(b.date));

    const labels = workouts.map((w) => w.date.slice(5));
    let data = [];
    let labelText = (ex && ex.label) || "Exercice";

    if (ex && ex.type === "duration") {
      data = workouts.map((w) => (Number(w.duration) || 0));
      labelText += " (minutes)";
    } else if (ex && ex.type === "bodyweight") {
      data = workouts.map((w) => (Number(w.sets || 0) * Number(w.reps || 0)));
      labelText += " (rép)";
    } else {
      /* weighted */
      data = workouts.map((w) => Number(w.sets || 0) * Number(w.reps || 0) * Number(w.weight || 0));
      labelText += " (volume)";
    }

    if (exerciseChart) exerciseChart.destroy();

    const ctx = document.getElementById("exerciseChart");
    if (!ctx) return;

    exerciseChart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: labelText,
            data,
            borderColor: colors.primary,
            backgroundColor: "rgba(79,152,163,.12)",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
          },
        ],
      },
      options: {
        plugins: { legend: { labels: { color: colors.text } } },
        scales: {
          x: { ticks: { color: colors.muted }, grid: { color: colors.grid } },
          y: { ticks: { color: colors.muted }, grid: { color: colors.grid } },
        },
      },
    });
  }

  /* Populate exercise selector (if present) and hook change */
  function initExerciseSelector() {
    const select = document.getElementById("exerciseSelect");
    if (!select) return;
    const exs = window.GymApp.getExercises();
    select.innerHTML = exs.length
      ? `<option value="">-- Choisir un exercice --</option>` + exs.map((e) => `<option value="${e.id}">${e.label} (${e.type})</option>`).join("")
      : `<option value="">Aucun exercice</option>`;

    select.onchange = () => {
      if (select.value) {
        drawExerciseChart(select.value);
      } else if (exerciseChart) {
        exerciseChart.destroy();
        exerciseChart = null;
      }
    };
  }

  window.GymCharts = { drawCharts, drawExerciseChart, initExerciseSelector };
})();
