module.exports = (pool) => {



    //define function to get all weekdays
    let getWeekdays = async () => {
        let days = await pool.query('SELECT weekday from weekdays');
        console.log(days.rows);
        return days.rows;
    };
    return {
        getWeekdays
    }
};