const reviews_root = document.getElementById("reviews_root");
const average_rating = document.getElementById("average_rating");

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
        average_rating.innerHTML += response.average_rating;
        fetch("/api/get-all-users").then((_) => {
            _.json().then((users_dict) => {
                for (let a = 0; a < response.comments.length; ++a) {
                    let comment = response.comments[a];
                    reviews_root.innerHTML += `
                <div>
                    <div>
                        ${users_dict[comment.user_id]}: ${comment.comment} <button></button>
                    </div>
                </div>
                `;
                }
            });
        });
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

// get the user's rating for the song if they have one. If they don't, do anything, but if they do, highlight the rating that they currently have.
fetch("/api/user-song-rating", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    credentials: "same-origin",
    body: JSON.stringify({song_id: localStorage.getItem("song_id")})
}).then((_) => {
    _.json().then((response) => {
        // user has a rating
        if (response.rating != -1) {
            let rating = String(response.rating);
            let buttons = document.getElementsByClassName("rate_button");
            for (let a = 0; a < buttons.length; ++a) {
                let button = buttons[a];
                if (button.innerHTML === rating) {
                    button.setAttribute("id", "red_button");
                }
            }
        }
    });
});

let buttons = document.getElementsByClassName("rate_button");
function findSpecialButton() {
    for (let a = 0; a < buttons.length; ++a) {
        let button = buttons[a];
        if (button.hasAttribute("id")) {
            return button;
        }
    }
}

for (let a = 0; a < buttons.length; ++a) {
    let button = buttons[a];
    button.addEventListener("click", () => {
        // dont do anything if this isn't already the selected attribute
        if (!button.hasAttribute("id")) {
            if (findSpecialButton()) {
                findSpecialButton().removeAttribute("id");
            }
            button.setAttribute("id", "red_button");
            // make request to change user's rating, take the new average rating that the server returns and update the HTML with it
            fetch("/api/update-user-song-rating", {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({song_id: localStorage.getItem("song_id"), new_rating: button.innerHTML})
            }).then((_) => {
                _.json().then((response) => {
                    average_rating.innerHTML = response.average_rating;
                });
            });
        }
    });
}
