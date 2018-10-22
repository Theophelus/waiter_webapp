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

    it('Should be able to return all days of the week', async function () {

        assert.deepEqual(await newWaiter.getWeekdays([]), [{
            "weekday": 'Monday'},
            { "weekday": "Tuesday"},
            {"weekday": "Wednesday"},
            {"weekday": "Thursday"},
            {"weekday": "Friday"},
            {"weekday": "Saturday"},
            {"weekday": "Sunday"}
        ]);
    })
    it('Should check if the names is already if it does return true', async () => {
        await newWaiter.checkNames('ace');
        assert.deepEqual(await newWaiter.getNames('Busisile', false));
    });


    it('Should set names into the database and check if that name is true', async () => {
        await newWaiter.setWaiters('Anele')
        assert.equal(await newWaiter.checkNames('Anele'), true);

    });
    it('Should be able to get entered name with checked working days and enter names in the database', async () => {
        await newWaiter.setWAiterAndDays('ace', ['Monday', 'Thursday']);
        await newWaiter.setWAiterAndDays('anele', ['Monday', 'Thursday', 'Friday']);
        assert.deepEqual(await newWaiter.getCheckedDays('ace'), [{
            weekday: 'Monday', checked: 'checked'},
            {weekday: 'Tuesday'},
            {weekday: 'Wednesday'},
            {weekday: 'Thursday', checked: 'checked'},
            {weekday: 'Friday'},
            {weekday: 'Saturday'},
            {weekday: 'Sunday'}
        ]);
        assert.deepEqual(await newWaiter.getCheckedDays('anele'),[ { weekday: 'Monday', checked: 'checked' },
        { weekday: 'Tuesday' },
        { weekday: 'Wednesday' },
        { weekday: 'Thursday', checked: 'checked' },
        { weekday: 'Friday', checked: 'checked' },
        { weekday: 'Saturday' },
        { weekday: 'Sunday' } ] );
    });

    it('Should be able to assign blue colors if there is only one waiters available for each days', async () => {
        await newWaiter.setWAiterAndDays('sbu', ['Monday', 'Sunday'])
        assert.deepEqual(await newWaiter.adminCheckWaiters(),[ { weekday: 'Monday', waiter: [{'names': 'sbu'}], colors: 'blue' },
        { weekday: 'Tuesday', waiter: [], colors: 'blue' },
        { weekday: 'Wednesday', waiter: [], colors: 'blue' },
        { weekday: 'Thursday', waiter: [], colors: 'blue' },
        { weekday: 'Friday', waiter: [], colors: 'blue' },
        { weekday: 'Saturday', waiter: [], colors: 'blue' },
        { weekday: 'Sunday', waiter: [{'names': 'sbu'}], colors: 'blue' } ])
    });
});