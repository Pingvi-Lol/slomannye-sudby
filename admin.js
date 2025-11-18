// admin logic - uses same STORAGE_KEY
const STORAGE_KEY = "slomannye_ep";
const PASSWORD = "Ster4728";

let store = { "1": [], "2": [], "3": [], "4": [] };
let editing = { season: null, index: -1 };

function loadLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      store = JSON.parse(raw);
    } catch (e) {
      console.error("Ошибка парсинга localStorage", e);
    }
  }
  refreshList();
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

document.getElementById("loginBtn").addEventListener("click", () => {
  const p = document.getElementById("pass").value;
  if (p === PASSWORD) {
    document.getElementById("login-box").classList.add("hidden");
    document.getElementById("panel").classList.remove("hidden");
    loadLocal();
  } else {
    document.getElementById("error").textContent = "Неверный пароль";
  }
});

document.getElementById("addBtn").addEventListener("click", () => {
  const s = document.getElementById("season").value;
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  if (!title || !content) { alert("Заполните поля"); return; }

  if (!store[s]) store[s] = [];

  if (editing.season && editing.index >= 0) {
    // save edit
    store[editing.season][editing.index] = { title, content };
    editing = { season: null, index: -1 };
    alert("Серия отредактирована");
  } else {
    store[s].push({ title, content });
    alert("Серия добавлена");
  }

  saveLocal();
  refreshList();
  clearForm();
});

document.getElementById("clearBtn").addEventListener("click", clearForm);

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  editing = { season: null, index: -1 };
}

function refreshList() {
  const ul = document.getElementById("episodes-list");
  ul.innerHTML = "";
  for (let s = 1; s <= 2; s++) {
    const arr = store[s] || [];
    arr.forEach((ep, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div style="flex:1">
          <strong>S${s}E${i+1}</strong> — ${escapeHtml(ep.title)}
        </div>
        <div style="display:flex;gap:8px">
          <button class="small-btn" data-action="edit" data-season="${s}" data-index="${i}">Ред.</button>
          <button class="small-btn" data-action="del" data-season="${s}" data-index="${i}">Удал.</button>
        </div>
      `;
      ul.appendChild(li);
    });
  }
}

document.getElementById("episodes-list").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const s = btn.dataset.season;
  const idx = Number(btn.dataset.index);
  if (action === "edit") {
    document.getElementById("season").value = s;
    document.getElementById("title").value = store[s][idx].title;
    document.getElementById("content").value = store[s][idx].content;
    editing = { season: s, index: idx };
  } else if (action === "del") {
    if (confirm("Удалить эту серию?")) {
      store[s].splice(idx, 1);
      saveLocal();
      refreshList();
    }
  }
});

document.getElementById("exportAdmin").addEventListener("click", () => {
  downloadJson("episodes_export.json", store);
});

document.getElementById("importAdmin").addEventListener("click", () => {
  document.getElementById("importAdminInput").click();
});

document.getElementById("importAdminInput").addEventListener("change", (ev) => {
  const f = ev.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = (e) => {
    try {
      const j = JSON.parse(e.target.result);
      // accept flat map or nested seasons
      if (j.seasons) {
        store = {
          "1": j.seasons["1"]?.episodes || [],
          "2": j.seasons["2"]?.episodes || [],
          "3": j.seasons["3"]?.episodes || [],
          "4": j.seasons["4"]?.episodes || []
        };
      } else {
        store = {
          "1": j["1"] || [],
          "2": j["2"] || [],
          "3": j["3"] || [],
          "4": j["4"] || []
        };
      }
      saveLocal();
      refreshList();
      alert("Импорт успешно выполнен");
    } catch (err) {
      alert("Ошибка при импорте JSON");
      console.error(err);
    }
  };
  r.readAsText(f, "utf-8");
});

document.getElementById("wipeData").addEventListener("click", () => {
  if (!confirm("Удалить все данные в localStorage? Это нельзя отменить")) return;
  store = { "1": [], "2": [], "3": [], "4": [] };
  saveLocal();
  refreshList();
  alert("Данные удалены");
});

// util
function escapeHtml(s) {
  return (s + "").replace(/[&<>"']/g, function(m) {
    return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
  });
}

function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// initialize
loadLocal();
