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

    const exercises = (window.GymApp && window.GymApp.getExercises && window.GymApp.getExercises()) || [];

    const header = document.createElement("div");
    header.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3);";
    header.innerHTML = `<strong style=\"font-size:var(--text-sm);color:var(--color-primary);\">Exercice ${index + 1}</strong>`;
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-exercise-btn";
    removeBtn.style.cssText = "background:none;border:none;color:var(--color-text-muted);font-size:1.2rem;cursor:pointer;padding:0.2rem 0.5rem;";
    removeBtn.title = "Supprimer";
    removeBtn.textContent = "×";
    header.appendChild(removeBtn);
    block.appendChild(header);

    /* Exercise selector */
    if (exercises.length) {
      const label = document.createElement("label");
      label.innerHTML = `Exercice`;
      const select = document.createElement("select");
      select.name = "exerciseId";
      select.style.width = "100%";
      exercises.forEach((ex) => {
        const opt = document.createElement("option");
        opt.value = ex.id;
        opt.textContent = ex.label + " (" + ex.type + ")";
        opt.dataset.type = ex.type;
        select.appendChild(opt);
      });
      label.appendChild(select);
      block.appendChild(label);

      /* Metrics container */
      const metrics = document.createElement("div");
      metrics.className = "exercise-metrics";
      metrics.style.cssText = "margin-top:var(--space-2);";
      block.appendChild(metrics);

      function renderMetricsFor(type) {
        if (type === "duration") {
          metrics.innerHTML = `
            <label>Durée (minutes)
              <input type=\"number\" name=\"duration\" min=\"0\" step=\"1\" value=\"10\" style=\"min-height:46px;\">
            </label>
            <label>Notes
              <input type=\"text\" name=\"notes\" placeholder=\"Optionnel\">
            </label>
          `;
        } else if (type === "bodyweight") {
          metrics.innerHTML = `
            <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:var(--space-2);\">
              <label>Series
                <input type=\"number\" name=\"sets\" min=\"1\" value=\"4\" required style=\"min-height:46px;\">
              </label>
              <label>Reps
                <input type=\"number\" name=\"reps\" min=\"1\" value=\"8\" required style=\"min-height:46px;\">
              </label>
            </div>
            <label>Notes
              <input type=\"text\" name=\"notes\" placeholder=\"Optionnel\">
            </label>
          `;
        } else {
          metrics.innerHTML = `
            <div style=\"display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-2);\">
              <label>Series
                <input type=\"number\" name=\"sets\" min=\"1\" value=\"4\" required style=\"min-height:46px;\">
              </label>
              <label>Reps
                <input type=\"number\" name=\"reps\" min=\"1\" value=\"8\" required style=\"min-height:46px;\">
              </label>
              <label>Charge kg
                <input type=\"number\" name=\"weight\" min=\"0\" step=\"0.5\" value=\"40\" required style=\"min-height:46px;\">
              </label>
            </div>
            <label>Notes
              <input type=\"text\" name=\"notes\" placeholder=\"Optionnel\">
            </label>
          `;
        }
      }

      /* Initial render */
      renderMetricsFor(select.options[select.selectedIndex].dataset.type || select.value);

      select.addEventListener("change", () => renderMetricsFor(select.options[select.selectedIndex].dataset.type || select.value));
    } else {
      block.insertAdjacentHTML(
        'beforeend',
        `
        <div class="empty" style="margin-top:var(--space-2);">
          Aucun exercice n'est enregistré. Crée d'abord un exercice dans l'onglet Exercises, puis reviens ici pour le sélectionner.
        </div>
      `
      );
    }

    /* Bouton supprimer le bloc */
    block.querySelectorAll(".remove-exercise-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const list = document.getElementById("exerciseList");
        if (list.children.length <= 1) {
          alert("La seance doit contenir au moins un exercice.");
          return;
        }
        block.remove();
        reindexBlocks();
      });
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

  function refreshExerciseBlocks() {
    const exercises = (window.GymApp && window.GymApp.getExercises && window.GymApp.getExercises()) || [];
    document.querySelectorAll(".exercise-block").forEach((block) => {
      const select = block.querySelector('[name="exerciseId"]');
      if (!select) {
        return;
      }

      const currentValue = select.value;
      const currentType = select.selectedOptions[0] ? select.selectedOptions[0].dataset.type : null;
      select.innerHTML = "";

      exercises.forEach((ex) => {
        const opt = document.createElement("option");
        opt.value = ex.id;
        opt.textContent = `${ex.label} (${ex.type})`;
        opt.dataset.type = ex.type;
        select.appendChild(opt);
      });

      if (exercises.length) {
        select.value = exercises.some((ex) => ex.id === currentValue) ? currentValue : exercises[0].id;
        const nextType = select.selectedOptions[0] ? select.selectedOptions[0].dataset.type : currentType;
        select.dispatchEvent(new Event("change"));
      }
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
        const select = block.querySelector('[name="exerciseId"]');
        let exerciseId = null;
        let exerciseLabel = "";
        let sets = null;
        let reps = null;
        let weight = null;
        let duration = null;
        let notes = "";

        if (select) {
          exerciseId = select.value;
          const ex = window.GymApp.findExerciseById(exerciseId) || {};
          exerciseLabel = ex.label || "";
          if (ex.type === "duration") {
            duration = Number(block.querySelector('[name="duration"]').value) || 0;
            notes = block.querySelector('[name="notes"]').value.trim();
          } else if (ex.type === "bodyweight") {
            sets = Number(block.querySelector('[name="sets"]').value) || 0;
            reps = Number(block.querySelector('[name="reps"]').value) || 0;
            notes = block.querySelector('[name="notes"]').value.trim();
          } else {
            sets = Number(block.querySelector('[name="sets"]').value) || 0;
            reps = Number(block.querySelector('[name="reps"]').value) || 0;
            weight = Number(block.querySelector('[name="weight"]').value) || 0;
            notes = block.querySelector('[name="notes"]').value.trim();
          }
        }

        if (!exerciseLabel && !exerciseId) return; /* skip empty */

        state.workouts.push({ date, name, exerciseId, exercise: exerciseLabel, sets, reps, weight, duration, notes });
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
  /* Init exercise manager (partial: exercises.html) */
  function initExerciseManager() {
    const container = document.getElementById("exerciseCatalog");
    if (!container) return;

    const form = document.getElementById("exerciseForm");
    const labelInput = document.getElementById("exerciseLabel");
    const typeSelect = document.getElementById("exerciseType");

    function renderList() {
      const exs = window.GymApp.getExercises();
      if (!exs || !exs.length) {
        container.innerHTML = `<div class=\"muted\">Aucun exercice dans le catalogue.</div>`;
        return;
      }
      container.innerHTML = exs.map((ex) => `
        <div class=\"card\" style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2);\">
          <div><strong>${ex.label}</strong> <span class=\"muted\">${ex.type}</span></div>
          <div style=\"display:flex;gap:0.5rem;\">
            <button class=\"btn edit-ex\" data-id=\"${ex.id}\">✎</button>
            <button class=\"btn\" style=\"color:var(--color-danger,#e74c3c);\" data-del=\"${ex.id}\">×</button>
          </div>
        </div>`).join("");

      container.querySelectorAll("[data-del]").forEach((b) => {
        b.addEventListener("click", () => {
          const id = b.dataset.del;
          if (confirm("Supprimer cet exercice ?")) {
            window.GymApp.deleteExercise(id);
            refreshExerciseBlocks();
            renderList();
          }
        });
      });

      container.querySelectorAll(".edit-ex").forEach((b) => {
        b.addEventListener("click", () => {
          const id = b.dataset.id;
          const ex = window.GymApp.findExerciseById(id);
          if (!ex) return;
          const newLabel = prompt("Nom de l'exercice :", ex.label);
          if (newLabel === null) return;
          const newType = prompt("Type (weighted, bodyweight, duration) :", ex.type) || ex.type;
          window.GymApp.editExercise(id, { label: newLabel.trim(), type: newType.trim() });
          refreshExerciseBlocks();
          renderList();
        });
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const label = labelInput.value.trim();
      const type = typeSelect.value;
      if (!label) return;
      window.GymApp.addExercise(label, type);
      form.reset();
      refreshExerciseBlocks();
      renderList();
    });

    renderList();
  }

  window.GymForms = { initForms, initExerciseManager, refreshExerciseBlocks };
})();
