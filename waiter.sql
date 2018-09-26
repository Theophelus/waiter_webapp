create table waiter
(
    id serial primary key,
    names text not null
);

create table weedays
(
    id serial primary key,
    week_days text not null
);
create table days_booked
(
    id serial primary key,
    waiter_id int,
    foreign key (waiter_id) references waiter(id),
    weekdays_id int,
    foreign key (weekdays_id) references weekdays(id)
);
