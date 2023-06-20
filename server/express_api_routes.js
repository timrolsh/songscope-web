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

function findComment(final_object, comment_id) {
    for (let a = 0; a < final_object.comments.length; ++a) {
        let comment = final_object.comments[a];
        if (comment.id === comment_id) {
            return comment;
        }
    }
}
/*
{
    comment_id: null,
    comment_text: null,
    comment_username: null,
    comment_replies: []
}
*/
server.post("/api/song-info", (request, response) => {
    let final_object = {
        average_rating: null,
        comments: []
    };
    db.query("select avg(value) as average_rating from songscope.rating where song_id = $1;", [
        request.body.song_id
    ]).then(({rows}) => {
        final_object.average_rating = Math.round(rows[0].average_rating);
        db.query("select * from songscope.comment where song_id = $1;", [request.body.song_id]).then(({rows}) => {
            final_object.comments = rows;
            // add replies property to every comment
            for (let a = 0; a < final_object.comments.length; ++a) {
                final_object.comments[a].replies = [];
            }
            db.query("select * from songscope.reply where song_id = $1;", [request.body.song_id]).then(({rows}) => {
                for (let a = 0; a < rows.length; ++a) {
                    let row = rows[a];
                    let comment = findComment(final_object, row.comment_id);
                    comment.replies.push(row);
                }
                response.send(final_object);
            });
        });
    });
    // the song info we need average rating, then we need the comments with their replies and the amount of likes that each comment has
});

// TODO REMOVE THIS AFTER CS FAIR IT IS VERY BAD PRACTICE AND IS A HOTFIX
server.get("/api/get-all-users", (_, response) => {
    db.query("select id, username from songscope.user;").then(({rows}) => {
        let final_object = {};
        for (let a = 0; a < rows.length; ++a) {
            let row = rows[a];
            final_object[row.id] = row.username;
        }
        response.send(final_object);
    });
});

module.exports = server;
