const PASSWORD = "Ster4728";
let data = {};

async function loadEpisodes() {
    let res = await fetch("episodes.json");
    data = await res.json();
}

loadEpisodes();

function checkPass() {
    let p = document.getElementById("pass").value;
    if (p === PASSWORD) {
        document.getElementById("login-box").classList.add("hidden");
        document.getElementById("panel").classList.remove("hidden");
        refreshList();
    } else {
        document.getElementById("error").textContent = "Неверный пароль!";
    }
}

function refreshList() {
    let list = document.getElementById("episodes-list");
    list.innerHTML = "";

    for (let s = 1; s <= 2; s++) {
        data[s].forEach((ep, i) => {
            let li = document.createElement("li");
            li.innerHTML = `S${s}E${i+1} — ${ep.title}`;
            list.appendChild(li);
        });
    }
}

async function addEpisode() {
    let s = document.getElementById("season").value;
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;

    if (!title || !content) return alert("Заполни всё!");

    data[s].push({ title, content });

    await save();

    refreshList();

    alert("Эпизод добавлен!");
}

async function save() {
    let blob = new Blob([JSON.stringify(data, null, 4)], { type: "application/json" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "episodes.json";
    a.click();
}
