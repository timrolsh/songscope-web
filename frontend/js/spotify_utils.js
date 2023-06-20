// TODO clean this up for code style LATER
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
}
