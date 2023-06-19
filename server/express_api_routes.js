const server = require("./express_config");
const {googleClient} = require("./user_authentication");
const db = require("./db_connect");
const crypto = require("crypto");

// TODO add api endpoints and the code to handle them in this file. if this file gets too complex, refactor it and split it up more

/*
google authentication callback route, google posts back here after it is logged in with jwt which is stored in browser
cookies and validate JWT on every request
*/
server.post("/google-auth", (request, response) => {
    response.clearCookie("token");
    googleClient
        .verifyIdToken({
            idToken: request.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        .then((user) => {
            user = user.getPayload();
            response.cookie("token", request.body.credential);
            db.query("select * from songscope.user where google_auth_id = $1;", [user.sub]).then((dbResponse) => {
                // if user does not exist in the database, add a new entry for them
                if (dbResponse.rows.length === 0) {
                    db.query("insert into songscope.user (username, google_auth_id) values ($1, $2);", [
                        crypto.randomUUID(),
                        user.sub
                    ]).then(() => {
                        response.redirect("/");
                    });
                } else {
                    response.redirect("/");
                }
            });
        });
});

// get user info from google sub provided in token
server.get("/api/google-user-info", (request, response) => {
    const google_id = JSON.parse(atob(request.cookies.token.split(".")[1])).sub;
    db.query("select * from songscope.user where google_auth_id = $1;", [google_id]).then((dbResponse) => {
        response.send(dbResponse.rows[0]);
    });
});

server.post("/api/change-username", (request, response) => {
    const google_id = JSON.parse(atob(request.cookies.token.split(".")[1])).sub;
    db.query("update songscope.user set username = $1 where google_auth_id = $2;", [
        request.body.username,
        google_id
    ]).then(() => {
        response.send("OK");
    });
});

module.exports = server;
