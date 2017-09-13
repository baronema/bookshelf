var Book = require("../models/book");

module.exports = {
    isLoggedIn: function(req, res, next){
        
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    },
    
    checkBookOwner: function(req, res, next){
        
        if(req.isAuthenticated()){
            Book.findById(req.params.bookId, function(err, book){
               if(book.location.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("/library/" + req.user.username);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }
    },
    
    returnBook: function(req, res, next){
        
        if(req.isAuthenticated()){
            Book.findById(req.params.bookId, function(err, book){
                if(book.checkedLoc.borrowed === false){
                    req.flash("error", "This book is not borrowed!");
                    res.redirect("/library/" + req.user.username);
                } else if(book.location.id.equals(req.user._id)) {
                    next();
                } else {
                   req.flash("error", "Books must be returned by owner");
                   res.redirect("/library/" + req.user.username);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }
    },
    
    borrowBook: function(req, res, next){
        
        if(req.isAuthenticated()){
            Book.findById(req.params.bookId, function(err, book){
              
               if(book.location.id.equals(req.user._id)){
                   req.flash("error", "You can not checkout your own books!");
                   res.redirect("/library/" + req.user.username);
               } else {
                   next();
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("login");
        }
    },
}