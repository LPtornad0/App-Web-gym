(function () {

  /* ── KPIs ───────────────────────────────────────────── */
  function renderKPIs() {
    const { state, $, volume } = window.GymApp;
    $("#kpiWorkouts").textContent = state.workouts.length;
    $("#kpiVolume").textContent = `${Math.round(state.workouts.reduce((sum, w) => sum + volume(w), 0))} kg`;
    const latest = [...state.measurements].sort((a, b) => b.date.localeCompare(a.date))[0];
    $("#kpiWeight").textContent = latest ? `${latest.weight} kg` : "-";
    const goalsCompletion = state.goals.length
      ? Math.round(state.goals.reduce((sum, g) => sum + Math.min((g.current / g.target) * 100, 100), 0) / state.goals.length)
      : 0;
    $("#kpiGoals").textContent = `${goalsCompletion}%`;
  }

  /* ── Dashboard recent ───────────────────────────────── */
  function renderRecent() {
    const { state, $, volume } = window.GymApp;
    const rows = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
    $("#recentWorkouts").innerHTML = rows.length
      ? rows.map((w) =>
          `<div class="mini"><strong>${w.exercise}</strong><span class="muted">${w.date} · ${w.name}</span><div class="muted">${w.sets} x ${w.reps} a ${w.weight} kg · ${Math.round(volume(w))} kg volume</div></div>`
        ).join("")
      : `<div class="empty">Ajoute une seance pour commencer.</div>`;
  }

  /* ── Liste seances (historique) ─────────────────────── */
  function renderWorkoutList() {
    const { state, $, volume, save } = window.GymApp;

    /* Regrouper par seance (date + name) */
    const grouped = {};
    state.workouts.forEach((w, idx) => {
      const key = `${w.date}__${w.name}`;
      if (!grouped[key]) grouped[key] = { date: w.date, name: w.name, exercises: [] };
      grouped[key].exercises.push({ ...w, _idx: idx });
    });

    const seances = Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));

    if (!seances.length) {
      $("#workoutList").innerHTML = `<div class="empty">Aucune seance enregistree.</div>`;
      return;
    }

    $("#workoutList").innerHTML = seances.map((seance) => {
      const exHtml = seance.exercises.map((ex) =>
        `<div class="mini" style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <strong>${ex.exercise}</strong>
            <div class="muted">${ex.sets} x ${ex.reps} a ${ex.weight} kg &middot; Volume ${Math.round(volume(ex))} kg</div>
            ${ex.notes ? `<div class="muted">${ex.notes}</div>` : ""}
          </div>
          <button class="btn" style="padding:0.25rem 0.6rem;font-size:0.75rem;color:var(--color-danger,#e74c3c);" data-del-exercise="${ex._idx}" title="Supprimer cet exercice">×</button>
        </div>`
      ).join("");

      const seanceKey = `${seance.date}__${seance.name}`;
      return `<div class="card" style="margin-bottom:var(--space-3);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2);">
          <div><strong>${seance.name}</strong> <span class="muted">${seance.date}</span></div>
          <button class="btn" style="padding:0.25rem 0.75rem;font-size:0.75rem;color:var(--color-danger,#e74c3c);" data-del-seance="${seanceKey}" title="Supprimer la seance">Supprimer</button>
        </div>
        ${exHtml}
      </div>`;
    }).join("");

    /* Deleguer les clics suppression exercice */
    $("#workoutList").querySelectorAll("[data-del-exercise]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.delExercise, 10);
        if (confirm("Supprimer cet exercice ?")) {
          state.workouts.splice(idx, 1);
          save();
          renderAll();
        }
      });
    });

    /* Deleguer les clics suppression seance */
    $("#workoutList").querySelectorAll("[data-del-seance]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.delSeance;
        if (confirm("Supprimer toute la seance (tous les exercices) ?")) {
          const [date, name] = key.split("__");
          state.workouts = state.workouts.filter((w) => !(w.date === date && w.name === name));
          save();
          renderAll();
        }
      });
    });
  }

  /* ── Mensurations ───────────────────────────────────── */
  function renderMeasurementList() {
    const { state, $ } = window.GymApp;
    const rows = [...state.measurements].sort((a, b) => b.date.localeCompare(a.date));
    $("#measurementList").innerHTML = rows.length
      ? rows.map((m) =>
          `<div class="mini"><strong>${m.weight} kg</strong><span class="muted">${m.date}</span><div class="muted">MG ${m.bodyFat || "-"}% &middot; Taille ${m.waist || "-"} cm &middot; Bras ${m.arm || "-"} cm &middot; Cuisse ${m.thigh || "-"} cm</div></div>`
        ).join("")
      : `<div class="empty">Aucune mensuration enregistree.</div>`;
  }

  /* ── Objectifs ──────────────────────────────────────── */
  function renderGoals() {
    const { state, $, save } = window.GymApp;

    if (!state.goals.length) {
      $("#goalList").innerHTML = `<div class="empty">Aucun objectif defini.</div>`;
      return;
    }

    $("#goalList").innerHTML = state.goals.map((goal, idx) => {
      const progress = Math.min((goal.current / goal.target) * 100, 100);
      return `<div class="card" style="margin-bottom:var(--space-3);" data-goal-idx="${idx}">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <strong>${goal.label}</strong> <span class="pill">${goal.type}</span>
            <div class="muted" style="margin-top:var(--space-1);">${goal.current} / ${goal.target} &middot; ${Math.round(progress)}%</div>
          </div>
          <div style="display:flex;gap:0.4rem;">
            <button class="btn" style="padding:0.25rem 0.6rem;font-size:0.75rem;" data-edit-goal="${idx}" title="Modifier">&#9998;</button>
            <button class="btn" style="padding:0.25rem 0.6rem;font-size:0.75rem;color:var(--color-danger,#e74c3c);" data-del-goal="${idx}" title="Supprimer">&times;</button>
          </div>
        </div>
        <div style="margin-top:var(--space-2);height:6px;border-radius:999px;background:var(--color-border);overflow:hidden;">
          <div style="height:100%;width:${Math.round(progress)}%;background:var(--color-primary);border-radius:999px;"></div>
        </div>
      </div>`;
    }).join("");

    /* Suppression objectif */
    $("#goalList").querySelectorAll("[data-del-goal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.delGoal, 10);
        if (confirm("Supprimer cet objectif ?")) {
          state.goals.splice(idx, 1);
          save();
          renderAll();
        }
      });
    });

    /* Modification objectif */
    $("#goalList").querySelectorAll("[data-edit-goal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.editGoal, 10);
        const goal = state.goals[idx];
        const newLabel = prompt("Nom de l objectif :", goal.label);
        if (newLabel === null) return;
        const newTarget = prompt("Valeur cible :", goal.target);
        if (newTarget === null) return;
        const newCurrent = prompt("Valeur actuelle :", goal.current);
        if (newCurrent === null) return;
        goal.label = newLabel.trim() || goal.label;
        goal.target = Number(newTarget) || goal.target;
        goal.current = Number(newCurrent);
        save();
        renderAll();
      });
    });
  }

  /* ── Profils ────────────────────────────────────────── */
  function renderProfileSelector() {
    const { getProfiles, getActiveIndex, setActiveProfile, addProfile, deleteProfile, renameProfile } = window.GymApp;
    const { renderAll } = window.GymUI;
    const profiles = getProfiles();
    const activeIdx = getActiveIndex();
    const container = document.getElementById("profileSelector");
    if (!container) return;

    container.innerHTML = `
      <select id="profileSelect" style="flex:1;padding:0.4rem 0.6rem;border-radius:var(--radius-md);background:var(--color-surface-2);border:1px solid var(--color-border);color:var(--color-text);font-size:var(--text-sm);">
        ${profiles.map((p, i) => `<option value="${i}" ${i === activeIdx ? "selected" : ""}>${p.name}</option>`).join("")}
      </select>
      <button class="btn" id="profileRenameBtn" style="padding:0.4rem 0.7rem;font-size:0.8rem;" title="Renommer">&#9998;</button>
      <button class="btn btn-primary" id="profileAddBtn" style="padding:0.4rem 0.7rem;font-size:0.8rem;" title="Nouveau profil">+</button>
      <button class="btn" id="profileDelBtn" style="padding:0.4rem 0.7rem;font-size:0.8rem;color:var(--color-danger,#e74c3c);" title="Supprimer profil">&times;</button>
    `;

    document.getElementById("profileSelect").addEventListener("change", (e) => {
      setActiveProfile(parseInt(e.target.value, 10));
      renderAll();
    });

    document.getElementById("profileAddBtn").addEventListener("click", () => {
      const name = prompt("Nom du nouveau profil :");
      if (!name || !name.trim()) return;
      addProfile(name.trim());
      setActiveProfile(getProfiles().length - 1);
      renderAll();
    });

    document.getElementById("profileDelBtn").addEventListener("click", () => {
      if (getProfiles().length <= 1) { alert("Impossible de supprimer le seul profil."); return; }
      if (confirm(`Supprimer le profil "${getProfiles()[getActiveIndex()].name}" et toutes ses donnees ?`)) {
        deleteProfile(getActiveIndex());
        renderAll();
      }
    });

    document.getElementById("profileRenameBtn").addEventListener("click", () => {
      const idx = getActiveIndex();
      const newName = prompt("Nouveau nom :", getProfiles()[idx].name);
      if (!newName || !newName.trim()) return;
      renameProfile(idx, newName.trim());
      renderAll();
    });
  }

  /* ── renderAll ──────────────────────────────────────── */
  function renderAll() {
    const { save } = window.GymApp;
    const { drawCharts } = window.GymCharts;
    renderKPIs();
    renderRecent();
    renderWorkoutList();
    renderMeasurementList();
    renderGoals();
    renderProfileSelector();
    drawCharts();
    save();
  }

  window.GymUI = {
    renderKPIs,
    renderRecent,
    renderWorkoutList,
    renderMeasurementList,
    renderGoals,
    renderProfileSelector,
    renderAll,
  };
})();
