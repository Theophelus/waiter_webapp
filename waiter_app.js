// todo: define a function called setWaiters with two parameters
// todo: check if name already exists in the databasea if not add name


module.exports = (pool) => {

    let setWaiters = async (waiterName) => {
        let getShifts;
        //define a variable to get all that getWaiterName
        let getDays = getWeekdays();
        if (waiterName == '' || !waiterName) {
            let checkName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName]);
            if (checkName.rowCount === 0) {
                await pool.query('INTERT INTO waiter(names) values($1)', [waiterName]);
            } else {
                if (checkName.rowCount) {
                    let getName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName]);
                    let getNameID = getName.id;
                    getShifts = await pool.query('SELECT weekdays_id FROM days_booked WHERE waiter_id = $1', [getNameID]);

                    getDays = getDays.filter((weekdays) => {
                        getShifts = getShifts.filter((workingShifts) => {
                            if (weekdays.weekdays_id === workingShifts.id) {
                                element['checked'] = 'checked';
                            }
                        });
                    });
                    return getDays;
                }
            }
        }
    }


    //define function to get all weekdays
    let getWeekdays = async () => {
        let days = await pool.query('SELECT weekday FROM weekdays');
        // console.log(days.rows);
        return days.rows;
    };
    return {
        getWeekdays,
        setWaiters
    }
};