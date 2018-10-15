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
        // await pool.query("delete from waiter;");
        // await pool.query("delete from weekdays;");
        await pool.query("delete from days_booked;");
    });

    it('Should return checked days', async function(){

        await newWaiter.setWaiters('Anele')

        await newWaiter.setWAiterAndDays('Anele', ['Monday','Wednesday'])

        let checked = await  newWaiter.getCheckedDays()

        console.log(checked)

    })
    // it('Should be able to check names and enter names in the database', async () => {
    //     await newWaiter.getWaiterName('Anele')
    //     assert.equal([{names: 'Anele'}], await newWaiter.getName('Anele'));
    // });
});