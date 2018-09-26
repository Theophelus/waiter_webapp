create table waiter
(
    id serial primary key,
    names text not null
);

create table weedays
(
    id serial primary key,
    weekday text not null
);
create table days_booked
(
    id serial primary key,
    waiter_id int,
    foreign key (waiter_id) references waiter(id),
    weekdays_id int,
    foreign key (weekdays_id) references weekdays(id)
);

insert into weekdays(weekday) values('Monday');
insert into weekdays(weekday) values('Tuesday');
insert into weekdays(weekday) values('Wednesday');
insert into weekdays(weekday) values('Thursday');
insert into weekdays(weekday) values('Friday');
insert into weekdays(weekday) values('Saturday');
insert into weekdays(weekday) values('Sunday');