const server = require("./express_api_routes");
const root_path = require("./root_path");

// TODO add page routes and the code to handle them in this file. if this file gets too complex, refactor it and split it up more

server.get("/", (_, response) => {
    response.sendFile(`${root_path}/pages/home.html`);
});

server.get("/song", (_, response) => {
    response.sendFile(`${root_path}/pages/song.html`);
});

module.exports = server;
