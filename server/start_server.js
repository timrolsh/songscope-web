require("dotenv").config();
// check if all enviornment variables are included in .env file
if (
    process.env.PORT &&
    process.env.PGUSER &&
    process.env.PGHOST &&
    process.env.PGDATABASE &&
    process.env.PGPASSWORD &&
    process.env.PGPORT
) {
    console.log("SONGSCOPE: All enviornment variables loaded");
} else {
    console.log(
        `SONGSCOPE: Not all enviornment variables have been properly declared. Create a .env file and make sure its format matches the one on the readme and it includes all of the necessary fields.`
    );
    process.exit(1);
}
const db = require("./db_connect");
const server = require("./express_page_routes");

db.query("select 1 * 1;")
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log(
                `SONGSCOPE: server launched on port ${process.env.PORT}. Go to http://localhost:${process.env.PORT}`
            );
        });
    })
    .catch(() => {
        console.log("SONGSCOPE: Unable to start server, cannot connect to database. ");
    });
