// simple version that doesn't need db or anything else to start up
const server = require("./express_page_routes");

server.listen(80, () => {
    console.log(
        `SONGSCOPE: server launched on port 80. Go to http://localhost`
    );
});
