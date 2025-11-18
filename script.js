let data = {};

async function loadEpisodes() {
    let res = await fetch("episodes.json");
    data = await res.json();

    // Получаем сезоны
    let s1 = data.seasons["1"].episodes.length;
    let s2 = data.seasons["2"].episodes.length;

    document.getElementById("count-s1").textContent = "Эпизодов: " + s1;
    document.getElementById("count-s2").textContent = "Эпизодов: " + s2;
}

loadEpisodes();

function openSeason(season) {
    let seasonData = data.seasons[season];

    document.querySelector(".seasons-box").classList.add("hidden");
    document.getElementById("episodes").classList.remove("hidden");

    let list = document.getElementById("episode-list");
    list.innerHTML = "";

    document.getElementById("season-title").textContent = "Сезон " + season;

    seasonData.episodes.forEach(ep => {
        let li = document.createElement("li");
        li.innerHTML = `<b>${ep.title}</b><br><pre>${ep.content}</pre>`;
        list.appendChild(li);
    });
}

function goBack() {
    document.querySelector(".seasons-box").classList.remove("hidden");
    document.getElementById("episodes").classList.add("hidden");
}
