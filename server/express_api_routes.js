const server = require("./express_config");
const root_path = require("./root_path");
const {googleClient} = require("./user_authentication");
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
            db.query("select * from thetutor4u.user where id = $1;", [user.sub]).then((dbResponse) => {
                // if user does not exist in the database, add a new entry for them
                if (dbResponse.rows.length === 0) {
                    db.query(
                        "insert into thetutor4u.user (id, email, username, first_name, last_name, iss) values ($1, $2, $3, $4, $5, $6);",
                        [user.sub, user.email, crypto.randomUUID(), user.given_name, user.family_name, user.iss]
                    ).then(() => {
                        db.query("insert into thetutor4u.language_user (language_code, user_id) values ($1, $2);", [
                            "en",
                            user.sub
                        ]).then(() => {
                            response.redirect("/");
                        });
                    });
                } else {
                    response.redirect("/");
                }
            });
        });
});


module.exports = server;