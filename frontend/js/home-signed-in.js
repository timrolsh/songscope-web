import {getUserInfo} from "/js/get-user.js";
const song_search = document.getElementById("song_search");
const table = document.getElementById("table");
getUserInfo().then((fetchResponse) => {
    fetchResponse.json().then((response) => {
        document.getElementById("welcome").innerHTML += ` ${response.username}!`;
    });
});

function formatTime(milliseconds) {
    var totalSeconds = Math.floor(milliseconds / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    var formattedTime = minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");

    return formattedTime;
}

document.getElementById("find_songs_button").addEventListener("click", () => {
    fetch("/api/spotify/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({search_string: song_search.value})
    }).then((_) => {
        _.json().then((items) => {
            items = items["tracks"]["items"];
            console.log(items);
            for (let a = 0; a < items.length; ++a) {
                let item = items[a];

                let artistString = "";
                let artists = item.artists;
                for (let b = 0; b < artists.length; ++b) {
                    artistString += artists[b].name;
                    if (b < artists.length - 1) {
                        artistString += ", ";
                    }
                }
                table.innerHTML += `
                <div class = "row">
                <div>${item.name}</div>
                <div>${artistString}</div>
                <div>${formatTime(item.duration_ms)}</div>
                <div>${item.album.name}</div>
                <img src="${item.album.images[0].url}" />
            </div>
                `;
            }
        });
    });
});
