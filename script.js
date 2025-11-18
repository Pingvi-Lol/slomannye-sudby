let data = {};

// загрузка эпизодов
async function loadEpisodes() {
    try {
        let res = await fetch("episodes.json");
        data = await res.json();

        document.getElementById("count-s1").textContent =
            "Эпизодов: " + (data["1"] ? data["1"].length : 0);

        document.getElementById("count-s2").textContent =
            "Эпизодов: " + (data["2"] ? data["2"].length : 0);

    } catch (e) {
        console.error("Ошибка загрузки episodes.json", e);
    }
}

loadEpisodes();

// открыть сезон
function openSeason(season) {
    document.querySelector(".seasons-box").classList.add("hidden");
    document.getElementById("episodes").classList.remove("hidden");

    let list = document.getElementById("episode-list");
    list.innerHTML = "";

    document.getElementById("season-title").textContent = "Сезон " + season;

    if (!data[season]) return;

    data[season].forEach((ep, i) => {
        let li = document.createElement("li");

        li.innerHTML = `
            <div class="episode-block">
                <h3>${ep.title}</h3>
                <div class="episode-text">${ep.content.replace(/\n/g, "<br>")}</div>
            </div>
        `;

        list.appendChild(li);
    });
}

// назад
function goBack() {
    document.querySelector(".seasons-box").classList.remove("hidden");
    document.getElementById("episodes").classList.add("hidden");
}

