// todo: define a function called setWaiters with two parameters
// todo: check if name already exists in the databasea if not add name
module.exports = (pool) => {
    //define function to get all weekdays
    let getWeekdays = async () => {
        let days = await pool.query('SELECT weekday FROM weekdays');
        return days.rows;
    };

    let setWaiters = async (waiterName) => {
        if (waiterName != '' || waiterName !== undefined) {
            let checkName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName.toLowerCase()]);
            console.log(checkName);
            if (checkName.rowCount > 0) {} else {
                await pool.query('INSERT INTO waiter(names) values($1)', [waiterName.toLowerCase()]);
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
            let checkName = await pool.query('SELECT id FROM waiter WHERE names = $1', [waiterName.toLowerCase()]);
            let namesID = checkName.rows[0];
            // console.log(namesID);
            let getShifts = await pool.query('SELECT weekdays_id FROM days_booked WHERE waiter_id = $1', [namesID.toLowerCase()]);
            console.log(getShifts);
            for (let workingShifts of getShifts) {
                for (let getDays of getAllDays) {
                    if (workingShifts.rows.weekdays_id === getDays.id) {
                        getDays['checked'] = 'checked';
                    }
                };
            };
            return getAllDays;
        }
    }

    let getNames = async (waiterName) => {
        let getWaiterNames = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName.toLowerCase()]);
        return getWaiterNames.rows[0];
    }
    //define a function to insert name.id and days.id selected in a server
    let setWAiterAndDays = async (setWaiterID, weekdaysID) => {

        if (await checkNames(setWaiterID)) {
            let setWaiter = await pool.query('SELECT * FROM waiter WHERE names = $1', [setWaiterID.toLowerCase()]);
            let getWaiterID = setWaiter.rows[0].id;
            console.log(getWaiterID);

            await pool.query('DELETE days_booked WHERE names_id = $1', [getWaiterID]);

            //Filter through the list of weekdaysweek
            for (let i = 0; i < weekdaysID.length; i++) {
                const element = weekdaysID[i];
                let daysID = await pool.query('SELECT id FROM weekdays WHERE weekday = $1', [element]);
                // console.log(daysID);
                await pool.query('INSERT INTO days_booked(waiter_id, weekdays_id) VALUES($1,$2)', [getWaiterID, daysID.rows[0]]);
            }
        } else {
            await setWaiters(setWaiterID);
            let setWaiter = await pool.query('SELECT id FROM waiter WHERE names = $1', [setWaiterID.toLowerCase()]);
            let getWaiterID = setWaiter.rows[0];
            for (let i = 0; i < weekdaysID.length; i++) {
                const element = weekdaysID[i];
                let daysID = await pool.query('SELECT id FROM weekdays WHERE weekday = $1', [element]);
                await pool.query('INSERT INTO days_booked(waiter_id, weekdays_id) VALUES($1, $2)', [getWaiterID.id, daysID.rows[0]]);
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