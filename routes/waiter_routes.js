module.exports = (waiter_app) => {


    let getWaiter = async (req, res, next) => {
        try {
            let waiterNames = req.params.names;
            if (await waiter_app.checkNames(waiterNames)) {
                let displayDays = await waiter_app.getCheckedDays(waiterNames);
                // let user_name = await waiter_app.getNames(waiterNames);
                // console.log(user_name);
                req.flash('info', `${waiterNames} YOU WILL BE WORKING ON THESES SELECTED DAYS..!`);
                res.render('waiters', {
                    user_name: waiterNames,
                    displayDays
                })
            } else {
                req.flash('info', `${waiterNames} BOOK YOUR SHIFTS FOR THE WEEK..!`);
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
    
            if (await waiter_app.checkNames(waiterNames)) {
                await waiter_app.setWAiterAndDays(waiterNames, days);
                await waiter_app.getNames(waiterNames);
                res.redirect('/waiters/' + waiterNames);
            } else {
                await waiter_app.setWAiterAndDays(waiterNames, days);
                req.flash('info', `${waiterNames}, THESE ARE THE WORKING DAYS YOU HAVE SELECTED.!`);
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
    let deleteWaiters =  async (req, res, next) => {
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