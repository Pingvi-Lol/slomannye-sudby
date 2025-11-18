let data = {};

async function loadEpisodes() {
    try {
        let res = await fetch("episodes.json");
        data = await res.json();

        // Обновляем количество серий
        document.getElementById("count-s1").textContent = "Эпизодов: " + (data["1"]?.length || 0);
        document.getElementById("count-s2").textContent = "Эпизодов: " + (data["2"]?.length || 0);
    } catch (err) {
        console.error("Ошибка загрузки episodes.json:", err);
    }
}

loadEpisodes();

function openSeason(season) {
    document.querySelector(".seasons-box").classList.add("hidden");
    document.getElementById("episodes").classList.remove("hidden");

    let list = document.getElementById("episode-list");
    list.innerHTML = "";

    document.getElementById("season-title").textContent = "Сезон " + season;

    // Если сезон пустой — покажем заглушку
    if (!data[season] || data[season].length === 0) {
        list.innerHTML = `<p style="color:gray">В этом сезоне пока нет серий.</p>`;
        return;
    }

    // Добавляем серии
    data[season].forEach(ep => {
        let li = document.createElement("li");
        li.classList.add("episode-box");

        li.innerHTML = `
            <h3>${ep.title}</h3>
            <div class="episode-text">
                ${ep.content.replace(/\n/g, "<br>")}
            </div>
        `;

        list.appendChild(li);
    });
}

function goBack() {
    document.querySelector(".seasons-box").classList.remove("hidden");
    document.getElementById("episodes").classList.add("hidden");
}
