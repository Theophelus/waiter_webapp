// todo: define a function called setWaiters with two parameters
// todo: check if name already exists in the databasea if not add name


module.exports = (pool) => {

    let setWaiters = async (waiterName) => {
        let getShifts;
        //define a variable to get all that getWaiterName
        let getDays = await getWeekdays();
        if (waiterName || waiterName !== undefined) {
            let checkName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName]);
            console.log(checkName);
            if (checkName.rowCount > 0) {} else {
                await pool.query('INSERT INTO waiter(names) values($1)', [waiterName]);
            }
            // else {
            //     if (checkName.rowCount) {
            //         let getName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName]);
            //         let getNameID = getName.rows[0];
            //         console.log(getNameID);
            //         getShifts = await pool.query('SELECT weekdays_id FROM days_booked WHERE waiter_id = $1', [getNameID.id]);
            //         console.log(getShifts);
            //         getDays = getDays.filter((weekdays) => {
            //             getShifts = getShifts.filter((workingShifts) => {
            //                 if (weekdays.weekdays_id === workingShifts.id) {
            //                     weekdays['checked'] = 'checked';
            //                 }
            //             });
            //         });
            //         return getDays;
            //     }
            // }
        }
    }

    //define a function to POSt a name and days selected in a server
    let setWAiterAndDays = async (usernames, days) => {

    }

    //define function to get all weekdays
    let getWeekdays = async () => {
        let days = await pool.query('SELECT weekday FROM weekdays');
        return days.rows;
    };
    return {
        getWeekdays,
        setWaiters,
        setWAiterAndDays
    }
};