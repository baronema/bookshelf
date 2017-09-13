var express     = require("express"),
    router      = express.Router(),
    Book        = require("../models/book"),
    request     = require("request"),
    middleware  = require("../middleware");

//GET REQUESTS
//==============================================================================

//NEW - show form to add new book
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("book/new", {title: null, author: null, publisher: null, 
                    isbn13: null, isbn10: null, coverArtURL: null}); 
});

//CHECKINOUT - Show form to check in book
router.get("/:bookId/checkin", middleware.returnBook, function(req, res){
    
    Book.findById(req.params.bookId, function(err, foundBook){
        if(err){
            console.log(err);
        } else {
            res.render("book/checkInOut", {book: foundBook});
        }
    });
});

//CHECKINOUT - Show form to check out book
router.get("/:bookId/checkout", middleware.borrowBook, function(req, res){
    
    Book.findById(req.params.bookId, function(err, foundBook){
        if(err){
            console.log(err);
        } else {
            res.render("book/checkInOut", {book: foundBook});
        }
    });
});


//EDIT - Show form to update book
router.get("/:bookId/edit", middleware.checkBookOwner, function(req, res){

    Book.findById(req.params.bookId, function(err, foundBook){
        if(err){
            console.log(err);
        } else {
            res.render("book/edit", {book: foundBook});
        }
    });
});

//DELETE - Show form to delete book
router.get("/:bookId/delete", middleware.checkBookOwner, function(req, res){

    Book.findById(req.params.bookId, function(err, foundBook){
        if(err){
            console.log(err);
        } else {
            res.render("book/delete", {book: foundBook});
        }
    });
});

//DELETE REQUESTS
//==============================================================================

//DELETE - Removes selected book from DB
router.delete("/:bookId", function(req, res){
    Book.findByIdAndRemove(req.params.bookId, function(err){
        if(err){
            console.log("Failed to Delete Book!!!", err);
        } else {
            res.redirect("/library/" + req.user.username);
        }
    })
});

//PUT REQUESTS
//==============================================================================

//EDIT - Edits the details of book in DB
router.put("/:bookId", function(req, res){
    var newData = 
        {
            title: req.body.title,
            publisher: req.body.publisher,
            author: req.body.author,
            isbn13: req.body.isbn13,
            isbn10: req.body.isbn10,
            unit: req.body.unit,
            subject: req.body.subject
        };
        
    Book.findByIdAndUpdate(req.params.bookId, {$set: newData}, function(err, book){
       if(err){
           req.flash("error", "Book: " + book.title + " was not updated");
           res.redirect("/" + book._id + "edit");
       } else {
           req.flash("success", "CHANGES TO: " + book.title + " have been saved");
           res.redirect("/library/" + req.user.username);
       }
    }); 
});

//CHECKINOUT - Submits book check out to DB
router.put("/:bookId/:borrowed", function(req, res){
    var newData,
        checkout = false;   // used to set flash message - default check in message
    
    if(req.params.borrowed == "true"){
        newData = {
            checkedLoc: {
                name: "N/A",
                id: null,
                borrowed: false
            }
        };
    } else {
        newData = {
            checkedLoc: {
                name: req.user.username,
                id: req.user._id,
                borrowed: true
            }
        };
        checkout = true; // display check out message
    }
        
    Book.findByIdAndUpdate(req.params.bookId, {$set: newData}, function(err, book){
       if(err){
           req.flash("error", "The book was not checked out!");
           res.render("edit");
       } else {
           if(checkout){
                req.flash("success", "CHECKED OUT: " + book.title + "  FROM: " + book.location.name);
           } else {
               req.flash("success", "RETURNED: " + book.title + "  TO: " + book.location.name);
           }
           res.redirect("/library/" + req.user.username);
       }
    }); 
});

module.exports = router;