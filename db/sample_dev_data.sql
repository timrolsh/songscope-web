insert into songscope."user" (username) values ('hey'), ('tim'), ('david'), ('nico');
insert into songscope."rating" (user_id, song_id, value)
values (1, '2Hh3ETdQKrmSI3QS0hme7g', 10),
       (2, '2Hh3ETdQKrmSI3QS0hme7g', 5),
       (3, '2Hh3ETdQKrmSI3QS0hme7g', 6),
       (4, '2Hh3ETdQKrmSI3QS0hme7g', 3);

insert into songscope.comment (user_id, song_id, comment)
values (1, '2Hh3ETdQKrmSI3QS0hme7g', 'This song is really good!'),
       (1, '2Hh3ETdQKrmSI3QS0hme7g', 'Changed my mind, this is actually terrible!'),
       (2, '2Hh3ETdQKrmSI3QS0hme7g', 'Might considering listening to this again, not sure though'),
       (3, '2Hh3ETdQKrmSI3QS0hme7g', 'Random text'),
       (4, '2Hh3ETdQKrmSI3QS0hme7g', 'More random text');

insert into songscope."like" (user_id, comment_id)
values (1, 1),
       (1, 2),
       (1, 3),
       (2, 1),
       (3, 1),
       (4, 1),
       (4, 2);

insert into songscope.reply (user_id, comment_id, comment, song_id)
values (2, 1, 'I actually disagree, I think that this song is terrible.', '2Hh3ETdQKrmSI3QS0hme7g'),
       (3, 1, 'I actually disagree with you disagreeing and I think that this song is gas.', '2Hh3ETdQKrmSI3QS0hme7g'),
       (3, 1, 'u guys are both wrong lwky', '2Hh3ETdQKrmSI3QS0hme7g'),
       (1, 2, 'Good take', '2Hh3ETdQKrmSI3QS0hme7g');