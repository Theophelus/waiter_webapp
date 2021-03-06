// todo: define a function called setWaiters with two parameters
// todo: check if name already exists in the databasea if not add name
module.exports = (pool) => {
    //define function to get all weekdays
    let getWeekdays = async () => {
        let days = await pool.query('SELECT weekday FROM weekdays');
        return days.rows;
    };

    let setWaiters = async (waiterName) => {
        waiterName = waiterName.toLowerCase();
        if (waiterName != '' || waiterName !== undefined) {
            let checkName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName]);
            if (checkName.rowCount > 0) {} else {
                await pool.query('INSERT INTO waiter(names) values($1)', [waiterName]);
                // await getCheckedDays(waiterName);
            }
        }
    };

    let setWAiterAndDays = async (setWaiter, setWeekdays) => {

        setWaiter = setWaiter.toLowerCase();
        // if (setWAiterAndDays == '') {
        //     return false;
        // }

        if (await checkNames(setWaiter)) {
            let waiterName = await getNames(setWaiter);
            let waiterID = waiterName.id;
            console.log(waiterID);

            await pool.query('DELETE FROM days_booked WHERE waiter_id = $1', [waiterID]);

            for (const dayId of setWeekdays) {
                let foundId = await pool.query('SELECT id From weekdays WHERE weekday=$1', [dayId]);
                foundId =foundId.rows[0].id
                await pool.query('INSERT INTO days_booked(waiter_id, weekdays_id) VALUES($1, $2)', [waiterID, foundId]);
            }

        } else {
            await setWaiters(setWaiter);
            let waiterName = await getNames(setWaiter);
            let waiterID = waiterName.id;

            for (const dayId of setWeekdays) {
                let foundId = await pool.query('SELECT id From weekdays WHERE weekday=$1', [dayId]);
                foundId = foundId.rows[0].id;
                await pool.query('INSERT INTO days_booked(waiter_id, weekdays_id) VALUES($1, $2)', [waiterID, foundId])
            }
        }
    }

    let checkNames = async (waiterName) => {
        waiterName = waiterName.toLowerCase();
        // if (waiterName != '' || waiterName !== undefined) {
        checkName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName]);
        if (checkName.rowCount > 0) {
            return true;
        } else {
            return false;
        }
        // }
    }

    let getCheckedDays = async (waiterName) => {
        waiterName = waiterName.toLowerCase();
        //define a variable to get all that getWaiterName
        let getAllDays = await getWeekdays();
        let getShifts = await pool.query('SELECT waiter.names, weekdays.weekday FROM days_booked INNER JOIN waiter ON days_booked.waiter_id = waiter.id INNER JOIN weekdays ON days_booked.weekdays_id = weekdays.id where names= $1', [waiterName]);
        let selectedShifts = getShifts.rows;

        // console.log(selectedShifts);
        for (let getDays of getAllDays) {
            for (let workingShifts of selectedShifts) {
                // console.log(workingShifts);
                if (getDays.weekday === workingShifts.weekday) {
                    getDays['checked'] = 'checked';
                }
                // console.log(workingShifts)
                // return workingShifts
            };
        };
        return getAllDays;

    }

    let getNames = async (waiterName) => {
        waiterName = waiterName.toLowerCase();
        let getWaiterNames = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName]);
        return getWaiterNames.rows[0];
    }

    //define a function for administrator ro check waiter on shifts
    let adminCheckWaiters = async () => {
        let getDays = await getWeekdays();
        for (const days of getDays) {
            let results = await pool.query('SELECT waiter.names as names FROM days_booked INNER JOIN waiter ON days_booked.waiter_id = waiter.id INNER JOIN weekdays ON days_booked.weekdays_id = weekdays.id where weekdays.weekday = $1', [days.weekday]);
            days.waiter = results.rows;
            // console.log(days.names = results.rows);
            if (days.waiter.length === 3) {
                days['colors'] = 'green';
            } else {
                if (days.waiter.length > 3) {
                    days['colors'] = 'red';
                } else {
                    if (days.waiter.length < 3 || days.waiter.length === 0) {
                        days['colors'] = 'blue';
                    }
                }
            }
        }
        // console.log(getDays);
        return getDays;
    }

    let deletewaiters = async () => {
        let waiterDelete = await pool.query('DELETE FROM waiter');
        return waiterDelete.rows;
    }
    return {
        getWeekdays,
        setWaiters,
        setWAiterAndDays,
        getCheckedDays,
        getNames,
        checkNames,
        adminCheckWaiters,
        deletewaiters
    }
};