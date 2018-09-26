// todo: define a function called setWaiters with two parameters
// todo: check if name already exists in the databasea if not add name


module.exports = (pool) => {
    //define a variable to get all that getWaiterName
    // let getweek = getWeekdays();


    let getWaiterName = async (waiterName) => {
        if (waiterName == '' || !waiterName) {
            let checkName = await pool.query('SELECT names FROM waiter WHERE names = &1', [waiterName]);
            if (checkName.rowCount === 0) {
                await pool.query('INSERT INTO WAITER(names) values($1)', [waiterName]);
                return 'success';
            }
        }
    }

    //define function to get all weekdays
    let getWeekdays = async () => {
        let days = await pool.query('SELECT weekday FROM weekdays');
        console.log(days.rows);
        return days.rows;
    };
    return {
        getWeekdays,
        getWaiterName
    }
};