const server = require("./express_api_routes");
const root_path = require("./root_path");

// TODO add page routes and the code to handle them in this file. if this file gets too complex, refactor it and split it up more

server.get("/", (request, response) => {
    // if user is signed in
    if (request.cookies.token) {
        response.sendFile(`${root_path}/pages/home-signed-in.html`);
    } else {
        response.sendFile(`${root_path}/pages/home.html`);
    }
});

server.get("/song", (_, response) => {
    response.sendFile(`${root_path}/pages/song.html`);
});

server.get("/settings", (request, response) => {
    // if user is signed in
    if (request.cookies.token) {
        response.sendFile(`${root_path}/pages/settings.html`);
    } else {
        response.redirect("/");
    }
});

module.exports = server;
