function formatTime(milliseconds) {
    var totalSeconds = Math.floor(milliseconds / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    var formattedTime = minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");

    return formattedTime;
}

function formatArtists(item) {
    let artistString = "";
    let artists = item.artists;
    for (let b = 0; b < artists.length; ++b) {
        artistString += artists[b].name;
        if (b < artists.length - 1) {
            artistString += ", ";
        }
    }
    return artistString;
}

// our own api
fetch("/api/song-info", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({song_id: localStorage.getItem("song_id")})
}).then((_) => {
    _.json().then((response) => {
        console.log(response);
        document.getElementById("average_rating").innerHTML += response.average_rating;
        fetch("/api/get-all-users").then((_) => {_.json().then((users_dict) => {
            
        })})
    });
});

// spotify api
fetch("/api/spotify/song-info", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({song_id: localStorage.getItem("song_id")})
}).then((_) => {
    _.json().then((item) => {
        document.getElementById("title").innerHTML += item.name;
        document.getElementById("artists").innerHTML += formatArtists(item);
        document.getElementById("album").innerHTML += item.album.name;
        document.getElementById("album_cover").setAttribute("src", item.album.images[0].url);
    });
});
