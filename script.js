let data = {};

async function loadEpisodes() {
    let res = await fetch("episodes.json");
    data = await res.json();

    document.getElementById("count-s1").textContent = "Эпизодов: " + data["1"].length;
    document.getElementById("count-s2").textContent = "Эпизодов: " + data["2"].length;
}

loadEpisodes();

function openSeason(season) {
    document.querySelector(".seasons-box").classList.add("hidden");
    document.getElementById("episodes").classList.remove("hidden");

    let list = document.getElementById("episode-list");
    list.innerHTML = "";

    document.getElementById("season-title").textContent = "Сезон " + season;

    data[season].forEach((ep, i) => {
        let li = document.createElement("li");
        li.innerHTML = `<b>${ep.title}</b><br><pre>${ep.content}</pre>`;
        list.appendChild(li);
    });
}

function goBack() {
    document.querySelector(".seasons-box").classList.remove("hidden");
    document.getElementById("episodes").classList.add("hidden");
}
