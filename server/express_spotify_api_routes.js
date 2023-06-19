const server = require("./express_api_routes");
fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=client_credentials&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret=${process.env.SPOTIFY_CLIENT_SECRET}`
})
    .then((spotifyApi) => spotifyApi.json())
    .then(({access_token}) => {
        setupRoutes(access_token);
    })
    .catch((error) => {
        console.log("SONGSCOPE: Failed connection to Spotify API");
        console.error(error);
    });

module.exports = server;

function setupRoutes(access_token) {
    server.post("/api/spotify/search", (request, response) => {
        fetch(`https://api.spotify.com/v1/search?q=${request.body.search_string}&type=album,track&limit=20`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
            .then((fetchSearch) => fetchSearch.json())
            .then((searchJSON) => {
                console.log("made it here");
                // Handle the response data here
                response.send(searchJSON);
            });
    });
}
