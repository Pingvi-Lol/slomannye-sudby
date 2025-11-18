let data = {};

async function loadEpisodes() {
    let res = await fetch("episodes.json");
    data = await res.json();

    // количество серий
    document.getElementById("count-s1").textContent =
        "Эпизодов: " + data.seasons["1"].episodes.length;

    // если хочешь — 2 сезона (можно удалить)
    if (data.seasons["2"]) {
        document.getElementById("count-s2").textContent =
            "Эпизодов: " + data.seasons["2"].episodes.length;
    }
}

loadEpisodes();

function openSeason(season) {
    document.querySelector(".seasons-box").classList.add("hidden");
    document.getElementById("episodes").classList.remove("hidden");

    let list = document.getElementById("episode-list");
    list.innerHTML = "";

    document.getElementById("season-title").textContent =
        "Сезон " + season + " — " + data.seasons[season].title;

    // ЗАГРУЖАЕМ ВСЕ ЭПИЗОДЫ
    data.seasons[season].episodes.forEach((ep, i) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <h3>${ep.title}</h3>
            <pre>${ep.content}</pre>
        `;
        list.appendChild(li);
    });
}

function goBack() {
    document.querySelector(".seasons-box").classList.remove("hidden");
    document.getElementById("episodes").classList.add("hidden");
}
