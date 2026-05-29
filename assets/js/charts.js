(function () {
  let volumeChart;
  let weightChart;

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

  window.GymCharts = { drawCharts };
})();
