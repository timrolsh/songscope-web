const pg = require("pg");
const db = new pg.Client(process.env.DB_CONNECTION_STRING);
db.connect().catch((error) => {
    console.log("SONGSCOPE: Unable to start server: DB issue");
    console.log(error);
    process.exit(1);
});
module.exports = db;
