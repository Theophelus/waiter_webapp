const assert = require('assert');
const Waiter = require('../waiter_app');
const pg = require("pg");
const Pool = pg.Pool;

//define a connection string to be able to connect to the database.
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/waiter_webapp_db';

const pool = new Pool({
    connectionString
});
let newWaiter = Waiter(pool);

describe('WAITER AVAILABILITY WEB APP', () => {
    beforeEach(async () => {
        // clean the tables before each test run
        await pool.query("delete from waiter;");
        await pool.query("delete from days_booked;");
    });

    it('Should all days of the week', async function(){

        assert.deepEqual(await newWaiter.getWeekdays([]), [ { "weekday": 'Monday' },
        {"weekday": "Tuesday" },
        {"weekday": "Wednesday" },
        {"weekday": "Thursday" },
        {"weekday": "Friday" },
        {"weekday": "Saturday" },
        {"weekday": "Sunday" }]);
    })
    it('Should set names into the database', async () => {
        assert.equal(await newWaiter.setWaiters('Anele'));
    });
    it('Should be able to get entered name with checked working days and enter names in the database', async () => {
        await newWaiter.setWAiterAndDays('ace', ['Monday', 'Thursday']);
        assert.deepEqual(await newWaiter.getCheckedDays('ace'), [ { weekday: 'Monday', checked: 'checked' },
        { weekday: 'Tuesday' },
        { weekday: 'Wednesday' },
        { weekday: 'Thursday', checked: 'checked' },
        { weekday: 'Friday' },
        { weekday: 'Saturday' },
        { weekday: 'Sunday' } ] );
    });
});