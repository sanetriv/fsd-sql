CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('me', 'google.com', 'my blog', 2);
insert into blogs (author, url, title, likes) values ('me', 'asd.com', 'not my blog', 4);