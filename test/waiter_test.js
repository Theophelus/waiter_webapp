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
        await pool.query("delete from registration_numbers;");

    });
});