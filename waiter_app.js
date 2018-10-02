// todo: define a function called setWaiters with two parameters
// todo: check if name already exists in the databasea if not add name


module.exports = (pool) => {
    //define function to get all weekdays
    let getWeekdays = async () => {
        let days = await pool.query('SELECT weekday FROM weekdays');
        return days.rows;
    };

    let setWaiters = async (waiterName) => {
        //define a variable to get all that getWaiterName
        // let getDays = await getWeekdays();
        if (waiterName != '' || waiterName !== undefined) {
            let checkName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName.toLowerCase()]);
            if (checkName.rowCount > 0) {} else {
                await pool.query('INSERT INTO waiter(names) values($1)', [waiterName.toLowerCase()]);
                // return 'successfull';
            }
        }
    };

    let checkNames = async (waiterName) => {
        if (waiterName != '' || waiterName !== undefined) {
            checkName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName.toLowerCase()]);
            if (checkName.rowCount > 0) {
                return true;
            } else {
                return false;
            }
        }
    }
    //define a function to insert name.id and days.id selected in a server
    let setWAiterAndDays = async (usernamesID, weekdaysID) => {
        // let getWeedaysId = getWeekdays();
        let waiterName = await getNames(usernamesID);
        let setWaiter = waiterName.id;
        if (setWaiter !== undefined) {
            await pool.query('DELETE days_booked WHERE names_id = $1', [setWaiter]);
        }
        //Filter through the list of weekdaysweek
        for (let daysID of weekdaysID) {
            // let returnDaysId = await pool.query('SELECT id FROM weekdays WHERE weekday = $1', [daysID])
            await pool.query('INSERT INTO days_booked(waiter_id, weekdays_id) VALUES($1, $2)', [setWaiter.id, daysID.id]);
            // return 'successfull'
        }
    };
    let getNames = async (waiterName) => {
        let getWaiterNames = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName.toLowerCase()]);
        return getWaiterNames.rows[0];
    }
    //define a function to GEt days checked
    let getCheckedDays = async (username) => {
        //define a variable to getAllDays
        let getAllDays = getWeekdays();
        if (await checkNames(waiterName)) {
            let myName = await getNames(username);
            let getNameID = myName.id;
            console.log(getNameID);
            getShifts = await pool.query('SELECT weekdays_id FROM days_booked WHERE waiter_id = $1', [getNameID]);
            console.log(getShifts);
            for (let workingShifts of getShifts) {
                for (let getDays of getAllDays) {
                    if (workingShifts.rows.weekdays_id === getDays.id) {
                        weekdays['checked'] = 'checked';
                    }
                };
            };
            return getAllDays;
        }
    }
    return {
        getWeekdays,
        setWaiters,
        setWAiterAndDays,
        getCheckedDays,
        getNames,
        checkNames
    }
};