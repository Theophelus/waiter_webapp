DROP TABLE IF EXISTS waiters, weekdays, days_booked;

create table waiter
(
    id serial not null primary key,
    names text not null
);

create table weekdays
(
    id serial not null primary key,
    weekday text UNIQUE
);

create table days_booked
(
    id serial not null primary key,
    waiter_id int NOT NULL,
    weekdays_id int NOT NULL,
    foreign key (waiter_id) references waiter(id) ON DELETE CASCADE,
    foreign key (weekdays_id) references weekdays(id) ON DELETE CASCADE
);

insert into weekdays(weekday) values('Monday');
insert into weekdays(weekday) values('Tuesday');
insert into weekdays(weekday) values('Wednesday');
insert into weekdays(weekday) values('Thursday');
insert into weekdays(weekday) values('Friday');
insert into weekdays(weekday) values('Saturday');
insert into weekdays(weekday) values('Sunday');