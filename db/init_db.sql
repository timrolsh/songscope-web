-- if the schema exists, remove it and recreate it from scratch
drop schema if exists songscope cascade;

create schema if not exists "songscope";

-- table of all Songscope users
create table songscope."user"
(
    id              serial not null primary key,
    username        text   not null,
--     google auth id if user is authenticated with google, empty string if they aren't signed in with google
    google_auth_id  text,
    profile_picture bytea,
    password_hash   text
);

-- table of all Songscope comments. A comment is made by one user.
create table songscope."comment"
(
    id      serial  not null primary key,
    user_id integer not null
        constraint fkey_user_id_id
            references songscope."user",
    song_id text    not null,
    comment text    not null
);

-- table of all Songscope likes. Every lake is made by one user on one comment.
create table songscope."like"
(
    user_id    integer not null
        constraint like_user_id_fk
            references songscope."user",
    comment_id integer not null
        constraint like_comment_id_fk
            references songscope.comment
);

/*
table of all Songscope comment replies. Each reply is made by one user on one comment. A user can reply to a comment,
but not reply to a reply on a comment. Maybe add functionality for comment threads at some point.
*/
create table songscope."reply"
(
    user_id    integer not null
        constraint reply_user_id_fk
            references songscope."user",
    comment_id integer not null
        constraint reply_comment_id_fk
            references songscope.comment,
    comment    text    not null
);

-- table of all Songscope ratings. Every rating is made by one user on one song. A user's rating can change
create table songscope."rating"
(
    user_id integer not null
        constraint rating_user_id_fk
            references songscope."user",
    song_id text    not null,
    value   integer not null
);



-- TODO possibly add a table of events at some point


