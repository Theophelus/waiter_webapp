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
            }
        }
    };

    let checkNames = async (waiterName) => {
        if (waiterName != '' || waiterName !== undefined) {
            checkName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName]);
            if (checkName.rowCount > 0) {
                return true;
            } else {
                return false;
            }
        }
    }
    let getCheckedDays = async (waiterName) => {
        //define a variable to get all that getWaiterName
        let getAllDays = await getWeekdays();
        if (await checkNames(waiterName)) {
            let checkName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName]);
            let namesID = checkName.rows[0].id;

            let getShifts = await pool.query('SELECT weekdays_id FROM days_booked WHERE waiter_id = $1', [namesID]);
            console.log(getShifts);
            let selectedShifts = getShifts.rows;

            for (let workingShifts of selectedShifts) {
                for (let getDays of getAllDays) {
                    if (workingShifts.weekday === getDays.weekday) {
                        getDays.checked = 'checked';
                    }
                };
            };
            console.log(getAllDays);
            return getAllDays;
        }
    }

    let getNames = async (waiterName) => {
        let getWaiterNames = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName.toLowerCase()]);
        return getWaiterNames.rows[0];
    }


    //define a function to insert name.id and days.id selected in a server
    let setWAiterAndDays = async (daysOfTheWeek, setWaiter) => {
        if (await checkNames(setWaiter)) {

            let getWaiterID = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName.toLowerCase()]);
            let waiterID = getWaiterID.rows[0].id;

            await pool.query('DELETE FROM days_booked WHERE waiter_id = $1', [getWaiterID]);
            for (let i = 0; i < daysOfTheWeek.length; i++) {
                const element = daysOfTheWeek[i];

                let daysID = await pool.query('SELECT id FROM weekdays WHERE weekday = $1', [element]);
                let days = daysID.rows[0].id;
                await pool.query('INSERT INTO days_booked(waiter_id, weekdays_id) VALUES($1, $2)', [waiterID, days]);
            }

        } else {
            await setWaiters(setWaiter);
            let setWaiterName = await pool.query('SELECT id FROM waiter WHERE names = $1', [setWaiter.toLowerCase()]);

            let getWaiterID = setWaiterName.rows[0].id;

            for (let i = 0; i < daysOfTheWeek.length; i++) {
                const element = daysOfTheWeek[i];

                let daysID = await pool.query('SELECT id FROM weekdays WHERE weekday = $1', [element]);
                let days = daysID.rows[0].id;
                await pool.query('INSERT INTO days_booked(waiter_id, weekdays_id) VALUES($1, $2)', [getWaiterID, days]);
            }
        }
    };

    return {
        getWeekdays,
        setWaiters,
        setWAiterAndDays,
        getCheckedDays,
        getNames,
        checkNames
    }
};