module.exports = (waiter_app) => {


    let getWaiter = async (req, res, next) => {
        try {
            let waiterNames = req.params.names;
            if (await waiter_app.checkNames(waiterNames)) {
                let displayDays = await waiter_app.getCheckedDays(waiterNames);
                await waiter_app.getNames(waiterNames);
                // console.log(user_name);
                req.flash('info', 'you will be working on these selected days..!');
                req.flash('msg', 'do you want to do any updates in your shifts..?');
                res.render('waiters', {
                    user_name: waiterNames,
                    displayDays
                })
            } else {
                req.flash('info', 'book your shifts for the week..!');
                req.flash('msg', 'PLEASE SELECT WORKING DAYS..!');
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
        try {

            let waiterNames = req.params.names;
            let days = Array.isArray(req.body.days) ? req.body.days : [req.body.days];

            if (waiterNames == undefined || days == '') {
                res.redirect('/waiters/' + waiterNames);
            }
            if (await waiter_app.checkNames(waiterNames)) {
                await waiter_app.setWAiterAndDays(waiterNames, days);
                await waiter_app.getNames(waiterNames);
                // req.flash('info', `${waiterNames}, do you want to do any updates in your shifts..?`);
                // req.flash('msg', 'You have selected these following days..!');
                res.redirect('/waiters/' + waiterNames);
            } else {
                await waiter_app.setWAiterAndDays(waiterNames, days);
                req.flash('info', 'these are the working shifts you have selected..!');
                req.flash('msg', 'You have selected these following days..!');
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