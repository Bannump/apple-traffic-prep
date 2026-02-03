(function () {
  "use strict";

  const STORAGE_KEY = "apple-traffic-sprint-state";
  const schedule = window.SPRINT_SCHEDULE || [];

  let state = {
    completed: {},  // slotId -> true
    notes: {}      // slotId -> string
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state.completed = parsed.completed || {};
        state.notes = parsed.notes || {};
      }
    } catch (_) {}
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function toggleCompleted(slotId) {
    state.completed[slotId] = !state.completed[slotId];
    saveState();
    renderAll();
  }

  function getNotes(slotId) {
    return state.notes[slotId] || "";
  }

  function setNotes(slotId, text) {
    state.notes[slotId] = text;
    saveState();
  }

  function countSlots(dayData) {
    return dayData.slots.length;
  }

  function countCompleted(dayData) {
    return dayData.slots.filter(function (s) { return state.completed[s.id]; }).length;
  }

  function getOverallStats() {
    let total = 0;
    let done = 0;
    schedule.forEach(function (d) {
      d.slots.forEach(function (s) {
        total += 1;
        if (state.completed[s.id]) done += 1;
      });
    });
    return { total, done };
  }

  function renderDayNav() {
    const nav = document.getElementById("dayNav");
    if (!nav) return;
    nav.innerHTML = schedule.map(function (d) {
      const completed = countCompleted(d);
      const total = countSlots(d);
      const pct = total ? Math.round((completed / total) * 100) : 0;
      const isActive = nav.dataset.currentDay === String(d.day);
      return (
        '<button type="button" class="day-nav-item' + (isActive ? ' active' : '') + '" data-day="' + d.day + '" aria-pressed="' + !!isActive + '">' +
          '<span class="day-nav-num">Day ' + d.day + '</span>' +
          '<span class="day-nav-pct">' + pct + '%</span>' +
        '</button>'
      );
    }).join("");
  }

  function renderDayCards() {
    const container = document.getElementById("dayCards");
    if (!container) return;
    container.innerHTML = schedule.map(function (d) {
      const completed = countCompleted(d);
      const total = countSlots(d);
      const pct = total ? Math.round((completed / total) * 100) : 0;
      return (
        '<article class="day-card" data-day="' + d.day + '">' +
          '<header class="day-card-header">' +
            '<h3>Day ' + d.day + '</h3>' +
            '<span class="day-card-pct">' + pct + '%</span>' +
          '</header>' +
          '<p class="day-card-title">' + escapeHtml(d.title) + '</p>' +
          '<div class="day-card-progress">' +
            '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
            '<span class="day-card-count">' + completed + ' / ' + total + ' slots</span>' +
          '</div>' +
        '</article>'
      );
    }).join("");
  }

  function renderSlots(dayData) {
    const container = document.getElementById("slots");
    if (!container) return;
    container.innerHTML = dayData.slots.map(function (slot) {
      const done = state.completed[slot.id];
      const hasNotes = (state.notes[slot.id] || "").trim().length > 0;
      const typeClass = slot.type === "break" ? "slot-break" : "slot-session";
      const bullets = (slot.bullets || []).map(function (b) {
        return '<li>' + escapeHtml(b) + '</li>';
      }).join("");
      return (
        '<div class="slot ' + typeClass + '" data-slot-id="' + slot.id + '">' +
          '<div class="slot-header">' +
            '<span class="slot-time">' + escapeHtml(slot.time) + '</span>' +
            '<label class="slot-check-wrap">' +
              '<input type="checkbox" class="slot-check" ' + (done ? 'checked' : '') + ' data-slot-id="' + slot.id + '" aria-label="Mark complete" />' +
              '<span class="slot-check-label">Done</span>' +
            '</label>' +
          '</div>' +
          '<h4 class="slot-title">' + escapeHtml(slot.title) + '</h4>' +
          (bullets ? '<ul class="slot-bullets">' + bullets + '</ul>' : '') +
          '<div class="slot-actions">' +
            '<button type="button" class="btn btn-notes" data-slot-id="' + slot.id + '" data-slot-title="' + escapeAttr(slot.title) + '" title="Notes">' +
              (hasNotes ? 'Edit notes' : 'Add notes') + (hasNotes ? ' ✓' : '') +
            '</button>' +
          '</div>' +
        '</div>'
      );
    }).join("");
  }

  function renderDayView(dayData) {
    document.getElementById("dayTitle").textContent = "Day " + dayData.day + ": " + dayData.title;
    document.getElementById("dayFocus").textContent = dayData.focus;
    const completed = countCompleted(dayData);
    const total = countSlots(dayData);
    const pct = total ? Math.round((completed / total) * 100) : 0;
    document.getElementById("dayProgressFill").style.width = pct + "%";
    document.getElementById("dayProgressValue").textContent = pct + "%";
    document.getElementById("dayNav").dataset.currentDay = String(dayData.day);
    renderSlots(dayData);
    renderDayNav();
  }

  function renderOverallProgress() {
    const { total, done } = getOverallStats();
    const pct = total ? Math.round((done / total) * 100) : 0;
    const fill = document.getElementById("overallProgressFill");
    const value = document.getElementById("overallProgressValue");
    if (fill) fill.style.width = pct + "%";
    if (value) value.textContent = pct + "%";
  }

  function renderAll() {
    renderDayNav();
    renderDayCards();
    renderOverallProgress();
    const currentDay = document.getElementById("dayNav").dataset.currentDay;
    const dayData = schedule.find(function (d) { return String(d.day) === currentDay; });
    if (dayData) renderDayView(dayData);
  }

  function openNotesModal(slotId, slotTitle) {
    const modal = document.getElementById("notesModal");
    const titleEl = document.getElementById("notesModalTitle");
    const input = document.getElementById("notesInput");
    const slotIdEl = document.getElementById("notesSlotId");
    if (!modal || !titleEl || !input || !slotIdEl) return;
    slotIdEl.value = slotId;
    titleEl.textContent = "Notes: " + slotTitle;
    input.value = getNotes(slotId);
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("modal-open");
    input.focus();
  }

  function closeNotesModal() {
    const modal = document.getElementById("notesModal");
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("modal-open");
  }

  function saveNotesFromModal() {
    const slotId = document.getElementById("notesSlotId").value;
    const text = document.getElementById("notesInput").value;
    if (slotId) {
      setNotes(slotId, text);
      closeNotesModal();
      renderAll();
    }
  }

  function escapeHtml(s) {
    if (!s) return "";
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function escapeAttr(s) {
    if (!s) return "";
    return escapeHtml(s).replace(/"/g, "&quot;");
  }

  function bindEvents() {
    document.getElementById("dayNav").addEventListener("click", function (e) {
      const btn = e.target.closest(".day-nav-item");
      if (!btn) return;
      const day = parseInt(btn.dataset.day, 10);
      const dayData = schedule.find(function (d) { return d.day === day; });
      if (!dayData) return;
      document.getElementById("viewDashboard").classList.remove("active");
      document.getElementById("viewDay").classList.add("active");
      document.querySelectorAll(".view-toggle").forEach(function (t) {
        t.classList.toggle("active", t.dataset.view === "day");
        t.setAttribute("aria-pressed", t.dataset.view === "day");
      });
      renderDayView(dayData);
    });

    document.getElementById("dayCards").addEventListener("click", function (e) {
      const card = e.target.closest(".day-card");
      if (!card) return;
      const day = parseInt(card.dataset.day, 10);
      const dayData = schedule.find(function (d) { return d.day === day; });
      if (!dayData) return;
      document.getElementById("viewDashboard").classList.remove("active");
      document.getElementById("viewDay").classList.add("active");
      document.querySelectorAll(".view-toggle").forEach(function (t) {
        t.classList.toggle("active", t.dataset.view === "day");
        t.setAttribute("aria-pressed", t.dataset.view === "day");
      });
      renderDayView(dayData);
    });

    document.querySelectorAll(".view-toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const view = btn.dataset.view;
        document.getElementById("viewDashboard").classList.toggle("active", view === "dashboard");
        document.getElementById("viewDay").classList.toggle("active", view === "day");
        document.querySelectorAll(".view-toggle").forEach(function (t) {
          t.classList.toggle("active", t.dataset.view === view);
          t.setAttribute("aria-pressed", t.dataset.view === view);
        });
      });
    });

    document.getElementById("slots").addEventListener("change", function (e) {
      if (e.target.classList.contains("slot-check")) {
        toggleCompleted(e.target.dataset.slotId);
      }
    });

    document.getElementById("slots").addEventListener("click", function (e) {
      const notesBtn = e.target.closest(".btn-notes");
      if (notesBtn) {
        e.preventDefault();
        openNotesModal(notesBtn.dataset.slotId, notesBtn.dataset.slotTitle || "Slot");
      }
    });

    document.querySelectorAll("[data-close=\"notesModal\"]").forEach(function (el) {
      el.addEventListener("click", closeNotesModal);
    });

    document.getElementById("saveNotes").addEventListener("click", saveNotesFromModal);

    document.getElementById("notesInput").addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNotesModal();
    });
  }

  function init() {
    loadState();
    if (schedule.length) {
      document.getElementById("dayNav").dataset.currentDay = String(schedule[0].day);
      renderDayView(schedule[0]);
    }
    renderAll();
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
