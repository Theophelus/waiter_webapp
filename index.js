const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const Waiter_app = require('./waiter_app');
const pg = require("pg");
const Pool = pg.Pool;

//define instances
let app = express();

// initialise session middleware - flash-express depends on it
app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));
// // initialise the flash middleware
app.use(flash());

let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
//define a connection string to be able to connect to the database.
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/waiter_webapp_db';
const pool = new Pool({
    connectionString
    // ssl: useSSL
});
// define instance of factory function
let waiter_app = Waiter_app(pool);
// configure express handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());
//configure public for=lder for static files
app.use(express.static('public'));

//define a GET Route Hadler to get waiter name o
app.get('/waiters/:names', async (req, res, next) => {
    try {
        let waiterNames = req.params.names;
        console.log(await waiter_app.setWaiters(waiterNames));
        // let setNames = await waiter_app.setWaiters(waiterNames);
        // req.flash('info', `${waiterNames}`);
        res.render('waiters', {
            // setNames,
            displayDays: await waiter_app.getWeekdays(waiterNames)
        });
    } catch (error) {
        next(error.stack);
    }
});
// Define a POST Route Handler to Send the days the waiter can work to the server.
// app.post('/waiters/:names', async (req, res) => {
//     let waiterNames = req.params.names;
//     console.log(await waiter_app.setWaiters(waiterNames));
//     await waiter_app.setWaiters(waiterNames);
//     res.redirect('/waiters/' + waiterNames);
// });

//Define a GET route handler to show which days waiters are available..
// app.get('/days', async (req, res) => {});


let PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
    console.log('app starting on PORT', PORT);
});