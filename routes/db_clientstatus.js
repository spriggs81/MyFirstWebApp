const express = require("express"),
      router = express.Router({mergeParams: true}),
      middleware = require("../middleware"),
      Dbclientstatus = require("../models/dbclientstatus");


//Product Index Ruote
router.get("/clientstatus", middleware.checkIsAdmin, (req, res) => {
    Dbclientstatus.find({}).sort({'keyname': 1}).exec((err, foundClientStatuses) => {
        if(err){
            console.log(err);
            req.flash('error', 'please report to an admin!');
            res.redirect('/');
        } else {
            res.render("db_clientstatus/index", {statuses: foundClientStatuses});
        }
    });
});


//Product New Route
router.post("/clientstatus/new", middleware.checkIsAdmin, (req, res) => {
    const name = req.sanitize(req.body.name);
    //removing special chara and spaces
    const step1 = name.replace(/[^A-Z0-9]/ig, "");
    //turning to lower case  -  used to help with dup entries
    const keyname = step1.toLowerCase();
    //checking to make sure that the entry isn't blank or not sense
    if(keyname === ''){
        req.flash('error',"Client Status can't be blank, only numbers or symbols!");
        res.redirect("/admin/db/clientstatus");
    } else {
        //checking for duplicates
        Dbclientstatus.find({keyname: keyname}, (err, foundStatus) => {
            if(err){
                req.flash('error', "Error with Finding Dbclientstatus!!!");
                res.redirect("/admin/db/clientstatus");
            } else if(foundStatus == false){
                //adding new product to DB
                 Dbclientstatus.create({name: name, keyname: keyname}, (err, newStatus) => {
                    if(err){
                        console.log(err);
                        req.flash('error', err+" error creating client status");
                        res.redirect("/admin/db/clientstatus");
                    } else {
                        req.flash('success', newStatus.name + " has been added to the Client Status Database!");
                        res.redirect("/admin/db/clientstatus");
                    }
                });
            } else {
                req.flash('error', 'This Status Already Exist!');
                res.redirect("/admin/db/clientstatus");
            }
        });
    }
});

//bd edit page routeEdit page
router.get("/clientstatus/:Dbclientstatus_id/edit", middleware.checkIsAdmin, (req, res) => {
    Dbclientstatus.findById(req.params.Dbclientstatus_id, (err, foundStatus) => {
        if(err){
            console.log(err);
            req.flash('error', "i'm an error");
            res.redirect('/admin/db/clientstatus');
        } else {
            res.render('db_clientstatus/edit', {status: foundStatus});
        }
    });
});


//DB Product Edit Route
router.put("/clientstatus/:Dbclientstatus_id/edit", middleware.checkIsAdmin, (req, res) => {
    const name = req.sanitize(req.body.name);
    //removing special chara and spaces
    const step1 = name.replace(/[^A-Z0-9]/ig, "");
    //turning to lower case  -  used to help with dup entries
    const keyname = step1.toLowerCase();
    //checking to make sure that the entry isn't blank or not sense
    if(keyname === ''){
        req.flash('error',"Client Status can't be blank, only numbers or symbols!");
        res.redirect("/admin/db/clientstatus");
    } else {
        //checking for duplicates
        Dbclientstatus.find({keyname: keyname}, (err, foundStatus) => {
            if(err){
                req.flash('error',err);
                res.redirect("/admin/db/clientstatus");
            } else if(foundStatus == false){
                //updating old product to new product name
                 Dbclientstatus.findByIdAndUpdate(req.params.Dbclientstatus_id,{name: name, keyname: keyname}, (err, updatedStatus) => {
                    if(err){
                        console.log(err);
                        req.flash('error', err);
                        res.redirect("/admin/db/clientstatus");
                    } else {
                        req.flash('success', updatedStatus.name + " has been updated in the Client Status Database!");
                        res.redirect("/admin/db/clientstatus");
                    }
                });
            } else {
                req.flash('error', 'This Client Status Already Exist!');
                res.redirect("/admin/db/clientstatus");
            }
        });
    }
});


//delete route for DB Server
router.delete("/clientstatus/:Dbclientstatus_id/delete", middleware.checkIsAdminDelete, (req, res) => {
    Dbclientstatus.findByIdAndRemove(req.params.Dbclientstatus_id, (err) => {
        if(err){
            req.flash('error', "We could not delete this Server!!!");
            res.redirect("/clientstatus");
        } else {
            req.flash("success", "This has been deleted");
            res.redirect("/admin/db/clientstatus");
        }
    });
});

module.exports = router;
