CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('me', 'google.com', 'my blog', 2);
insert into blogs (author, url, title, likes) values ('me', 'asd.com', 'not my blog', 4);

#############
#TESTSTUFF  

insert into users (username, name) values ('user1@asd.com', 'User 1');
insert into users (username, name) values ('user2@asd.com', 'User 2');

insert into blogs (author, url, title, likes, user_id) values ('User 1', 'asd.org', 'Blog 1', 1, 1);
insert into blogs (author, url, title, likes, user_id) values ('User 1', 'asd.org', 'Blog 2', 2, 1);
insert into blogs (author, url, title, likes, user_id) values ('User 2', 'asd.net', 'Blog 3', 3, 1);
insert into blogs (author, url, title, likes, user_id) values ('User 2', 'asd.net', 'Blog 4', 4, 2);

insert into readinglists (blog_id, user_id) values (1, 1);
insert into readinglists (blog_id, user_id) values (2, 1);
insert into readinglists (blog_id, user_id) values (2, 2);
insert into readinglists (blog_id, user_id) values (3, 2);
insert into readinglists (blog_id, user_id) values (4, 2);