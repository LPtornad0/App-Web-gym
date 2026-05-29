(function () {

  /* ── Export JSON ─────────────────────────────────────── */
  function exportData() {
    const { state } = window.GymApp;
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "gym-progress-mobile-data.json";
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  /* ── Bloc exercice dynamique ──────────────────────────── */
  function createExerciseBlock(index) {
    const block = document.createElement("div");
    block.className = "exercise-block";
    block.dataset.index = index;
    block.style.cssText = [
      "border:1.5px solid color-mix(in srgb, var(--color-primary) 35%, transparent)",
      "border-radius:var(--radius-lg)",
      "padding:var(--space-3)",
      "margin-bottom:var(--space-3)",
      "background:color-mix(in srgb, var(--color-primary) 5%, transparent)",
      "position:relative"
    ].join(";");

    block.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3);">
        <strong style="font-size:var(--text-sm);color:var(--color-primary);">Exercice ${index + 1}</strong>
        <button type="button" class="remove-exercise-btn" style="background:none;border:none;color:var(--color-text-muted);font-size:1.2rem;cursor:pointer;padding:0.2rem 0.5rem;" title="Supprimer">&times;</button>
      </div>
      <label>Exercice
        <input type="text" name="exercise" placeholder="Squat, Bench press..." required>
      </label>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-2);">
        <label>Series
          <input type="number" name="sets" min="1" value="4" required style="min-height:46px;">
        </label>
        <label>Reps
          <input type="number" name="reps" min="1" value="8" required style="min-height:46px;">
        </label>
        <label>Charge kg
          <input type="number" name="weight" min="0" step="0.5" value="40" required style="min-height:46px;">
        </label>
      </div>
      <label>Notes
        <input type="text" name="notes" placeholder="Optionnel">
      </label>
    `;

    /* Bouton supprimer le bloc */
    block.querySelector(".remove-exercise-btn").addEventListener("click", () => {
      const list = document.getElementById("exerciseList");
      if (list.children.length <= 1) {
        alert("La seance doit contenir au moins un exercice.");
        return;
      }
      block.remove();
      reindexBlocks();
    });

    return block;
  }

  function reindexBlocks() {
    document.querySelectorAll(".exercise-block").forEach((block, i) => {
      block.dataset.index = i;
      const title = block.querySelector("strong");
      if (title) title.textContent = `Exercice ${i + 1}`;
    });
  }

  /* ── Init formulaires ────────────────────────────────────── */
  function initForms() {
    const { state, $, today } = window.GymApp;
    const { renderAll } = window.GymUI;

    /* --- Seances ------------------------------------------------- */
    const workoutDateInput = $("#workoutDate");
    const workoutNameInput = $("#workoutName");
    const exerciseList    = $("#exerciseList");
    const addExerciseBtn  = $("#addExerciseBtn");

    workoutDateInput.value = today;

    /* Ajouter un premier bloc exercice au demarrage */
    exerciseList.appendChild(createExerciseBlock(0));

    /* Bouton "+ Ajouter un exercice" */
    addExerciseBtn.addEventListener("click", () => {
      const count = exerciseList.children.length;
      exerciseList.appendChild(createExerciseBlock(count));
      /* Scroll vers le nouveau bloc */
      exerciseList.lastElementChild.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    /* Soumission du formulaire seance */
    $("#workoutForm").addEventListener("submit", (event) => {
      event.preventDefault();

      const date = workoutDateInput.value;
      const name = workoutNameInput.value.trim();

      /* Recuperer tous les blocs exercices */
      const blocks = exerciseList.querySelectorAll(".exercise-block");
      blocks.forEach((block) => {
        const exercise = block.querySelector('[name="exercise"]').value.trim();
        const sets     = Number(block.querySelector('[name="sets"]').value);
        const reps     = Number(block.querySelector('[name="reps"]').value);
        const weight   = Number(block.querySelector('[name="weight"]').value);
        const notes    = block.querySelector('[name="notes"]').value.trim();

        if (!exercise) return; /* Ignorer les blocs vides */

        state.workouts.push({ date, name, exercise, sets, reps, weight, notes });
      });

      /* Reset du formulaire */
      workoutNameInput.value = "";
      workoutDateInput.value = today;
      exerciseList.innerHTML = "";
      exerciseList.appendChild(createExerciseBlock(0));

      renderAll();
    });

    /* --- Mensurations -------------------------------------------- */
    const measureDateInput = $("#measureDate");
    const bodyWeightInput  = $("#bodyWeight");
    const bodyFatInput     = $("#bodyFat");
    const waistInput       = $("#waist");
    const armInput         = $("#arm");
    const thighInput       = $("#thigh");

    measureDateInput.value = today;

    $("#measurementForm").addEventListener("submit", (event) => {
      event.preventDefault();
      state.measurements.push({
        date:    measureDateInput.value,
        weight:  Number(bodyWeightInput.value),
        bodyFat: bodyFatInput.value ? Number(bodyFatInput.value) : "",
        waist:   waistInput.value   ? Number(waistInput.value)   : "",
        arm:     armInput.value     ? Number(armInput.value)     : "",
        thigh:   thighInput.value   ? Number(thighInput.value)   : "",
      });
      event.target.reset();
      measureDateInput.value = today;
      renderAll();
    });

    /* --- Objectifs ----------------------------------------------- */
    $("#goalForm").addEventListener("submit", (event) => {
      event.preventDefault();
      state.goals.push({
        type:    $("#goalType").value,
        label:   $("#goalLabel").value.trim(),
        target:  Number($("#goalTarget").value),
        current: Number($("#goalCurrent").value),
      });
      event.target.reset();
      renderAll();
    });

    /* --- Export -------------------------------------------------- */
    $("#exportBtn").addEventListener("click", exportData);
  }

  window.GymForms = { initForms };
})();
