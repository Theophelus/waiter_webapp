module.exports = (waiter_app) => {


    let getWaiter = async (req, res, next) => {
        try {
            // req.flash('msg', 'PLEASE SELECT WORKING DAYS..!');
            let waiterNames = req.params.names;
            if (await waiter_app.checkNames(waiterNames)) {
                let displayDays = await waiter_app.getCheckedDays(waiterNames);
                await waiter_app.getNames(waiterNames);
                // console.log(user_name);
                req.flash('info', `${waiterNames} YOU Will Be Working On These Selected Day..!`);
                res.render('waiters', {
                    user_name: waiterNames,
                    displayDays
                })
            } else {
                req.flash('info', `${waiterNames} Book Your Shifts For The Week..!`);
                res.render('waiters', {
                    user_name: waiterNames,
                    displayDays: await waiter_app.getWeekdays(waiterNames)
                });
            }
        } catch (err) {
            console.error('catch the error', err);
        }
    }
    let setWaitersAndDays = async (req, res, next) => {
        req.flash('msg', 'You have selected these following days');
        try {

            let waiterNames = req.params.names;
            let days = Array.isArray(req.body.days) ? req.body.days : [req.body.days];

            if (waiterNames == undefined || days == '') {
                return res.redirect('/waiters/' + waiterNames);
            } else
            if (await waiter_app.checkNames(waiterNames)) {
                await waiter_app.setWAiterAndDays(waiterNames, days);
                await waiter_app.getNames(waiterNames);
                res.redirect('/waiters/' + waiterNames);
            } else {
                await waiter_app.setWAiterAndDays(waiterNames, days);
                req.flash('info', `${waiterNames}, these are the working shifts you have selected..!`);
                res.render('waiters', {
                    user_name: waiterNames,
                    displayDays: await waiter_app.getCheckedDays(waiterNames)
                });
            }

        } catch (err) {
            console.error('Catch the error', err);
        }
    };

    let getwaitersWithDays = async (req, res) => {
        try {
            res.render('days', {
                displayDays: await waiter_app.adminCheckWaiters()
            });

        } catch (error) {
            console.error('Chetch error', error);
        }
    };
    let deleteWaiters = async (req, res, next) => {
        try {
            await waiter_app.deletewaiters()
            // req.flash('success', 'All Registrayions Have Been Deleted Successfull...!');
            res.redirect('/days');
        } catch (error) {
            console.error('catch error', error);
        }
    };
    return {
        getWaiter,
        setWaitersAndDays,
        getwaitersWithDays,
        deleteWaiters
    }
}