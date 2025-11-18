// index page logic - uses localStorage key 'slomannye_ep'
const STORAGE_KEY = "slomannye_ep";

let store = { "1": [], "2": [], "3": [], "4": [] };

// load from localStorage or bundled default file
async function loadEpisodes() {
  // try localStorage first
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      store = JSON.parse(raw);
      updateCounts();
      return;
    } catch (e) {
      console.error("Ошибка парсинга localStorage", e);
    }
  }

  // fallback load bundled episodes.json (if present)
  try {
    const res = await fetch("episodes.json");
    if (res.ok) {
      const j = await res.json();
      // j can be either flat {"1":[...]} or nested {"seasons":{...}}
      if (j.seasons) {
        // convert to simple map
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
      saveStore();
      updateCounts();
    }
  } catch (e) {
    console.warn("Не удалось загрузить bundled episodes.json", e);
  }
}

function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function updateCounts() {
  document.getElementById("count-s1").textContent = "Эпизодов: " + (store["1"]?.length || 0);
  document.getElementById("count-s2").textContent = "Эпизодов: " + (store["2"]?.length || 0);
}

// render season
function openSeason(season) {
  document.querySelector(".seasons-box").classList.add("hidden");
  document.getElementById("episodes").classList.remove("hidden");
  document.getElementById("season-title").textContent = "Сезон " + season + (season === "1" ? " — Сломанные судьбы" : season === "2" ? " — Раскрытие тайн" : "");

  const list = document.getElementById("episode-list");
  list.innerHTML = "";

  const arr = store[season] || [];
  if (arr.length === 0) {
    list.innerHTML = `<p style="color:gray">В этом сезоне пока нет серий.</p>`;
    return;
  }

  arr.forEach((ep, idx) => {
    const li = document.createElement("li");
    li.className = "episode-item";
    li.innerHTML = `
      <div class="episode-block">
        <h3>${escapeHtml(ep.title)}</h3>
        <div class="episode-text">${escapeHtml(ep.content).replace(/\n/g, "<br>")}</div>
      </div>
    `;
    list.appendChild(li);
  });
}

function goBack() {
  document.querySelector(".seasons-box").classList.remove("hidden");
  document.getElementById("episodes").classList.add("hidden");
}

// Utilities
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

// export/import handlers
document.addEventListener("click", (e) => {
  if (e.target.matches(".open-btn")) {
    openSeason(e.target.dataset.season);
  }
  if (e.target.matches(".back-btn")) goBack();
});

document.getElementById("exportBtn").addEventListener("click", () => {
  downloadJson("episodes_export.json", store);
});

document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", (ev) => {
  const f = ev.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = (e) => {
    try {
      const j = JSON.parse(e.target.result);
      // try convert possible nested format
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
      saveStore();
      updateCounts();
      alert("Импорт выполнен успешно");
    } catch (err) {
      alert("Ошибка импорта JSON");
      console.error(err);
    }
  };
  r.readAsText(f, "utf-8");
});

// init
loadEpisodes();
