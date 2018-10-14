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
            let checkName = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName]);
            if (checkName.rowCount > 0) {} else {
                await pool.query('INSERT INTO waiter(names) values($1)', [waiterName]);

                // await getCheckedDays(waiterName);
            }
        }
    };

    let setWAiterAndDays = async (setWaiter, setWeekdays) => {
        if (await checkNames(setWaiter)) {
            let waiterName = await getNames(setWaiter);
            let waiterID = waiterName;


            await pool.query('DELETE FROM days_booked WHERE waiter_id = $1', [waiterID]);

            for (const dayId of setWeekdays) {
                console.log(dayId);
                let foundId = await pool.query('SELECT id From weekdays WHERE weekday=$1', [dayId]);
                await pool.query('INSERT INTO days_booked(waiter_id, weekdays_id) VALUES($1, $2)', [waiterID.id, foundId.rows[0].id]);
            }
        } else {
            await setWaiters(setWaiter);
            let waiterName = await getNames(setWaiter);
            let waiterID = waiterName;
            for (const dayId of setWeekdays) {
                let foundId = await pool.query('SELECT id From weekdays WHERE weekday=$1', [dayId]);
                await pool.query('INSERT INTO days_booked(waiter_id, weekdays_id) VALUES($1, $2)', [waiterID.id, foundId.rows[0].id])
            }
        }
    }

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
        let getShifts = await pool.query('SELECT waiter.names, weekdays.weekday FROM days_booked INNER JOIN waiter ON days_booked.waiter_id = waiter.id INNER JOIN weekdays ON days_booked.weekdays_id = weekdays.id where names= $1', [waiterName]);
        let selectedShifts = getShifts.rows;
        
        for (let getDays of getAllDays) {
            for (let workingShifts of selectedShifts) {
                console.log(workingShifts);
                if (workingShifts.weekday === getDays.weekday) {
                    workingShifts['checked'] = 'checked';
                }
            };
        };
        return getAllDays;
    }

    let getNames = async (waiterName) => {
        let getWaiterNames = await pool.query('SELECT * FROM waiter WHERE names = $1', [waiterName]);
        return getWaiterNames.rows[0];
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