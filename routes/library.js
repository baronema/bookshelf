var express     = require("express"),
    router      = express.Router(),
    Book        = require("../models/book"),
    middleware  = require("../middleware"),
    request     = require("request"),
    isbn        = require('node-isbn'),
    letters = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
				"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
	
// SANITIZE USER SEARCH PARAMETERS TO ESCAPE ANY POTENTIAL REGEX CHARACTERS				
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// GET REQUESTS
//==============================================================================

//INDEX - show signed in user library
router.get("/", middleware.isLoggedIn, function(req, res){
    res.redirect("/library/" + req.user.username);

});

//INDEX - Show books loaned to other classrooms 
router.get("/loaned", middleware.isLoggedIn, function(req, res){
    var classroom = req.user.username;

    Book.find({"location.name": classroom, "checkedLoc.borrowed": true}, function(err, bookList){
       if(err){
           console.log(err);
       } else {
            bookList.sort((a, b) => a.title.localeCompare(b.title));
            res.render("library/index", {books: bookList, letters: letters, library: "loaned"});
       }
    }
)});

//INDEX - Show books borrowed from other classrooms 
router.get("/borrowed", middleware.isLoggedIn, function(req, res){
    var classroom = req.user.username;
   
    Book.find({"checkedLoc.name": classroom}, function(err, bookList){
       if(err){
           console.log(err);
       } else {
            bookList.sort((a, b) => a.title.localeCompare(b.title));
            res.render("library/index", {books: bookList, letters: letters, library: "borrowed"});
       }
    }
)});

//INDEX - Show selected book library 
router.get("/:classroom", middleware.isLoggedIn, function(req, res){
    var classroom = req.params.classroom;
   
    Book.find({"location.name": req.params.classroom}, function(err, bookList){
       if(err){
           console.log(err);
       } else {
            bookList.sort((a, b) => a.title.localeCompare(b.title));
            res.render("library/index", {books: bookList, letters: letters, library: classroom});
       }
    }
)});

// POST REQUESTS
//==============================================================================

//NEW - add new book to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form to add to new book object
    var title = req.body.title,
        publisher = req.body.publisher,
        author = req.body.author,
        isbn13 = req.body.isbn13,
        isbn10 = req.body.isbn10,
        unit = req.body.unit,
        subject = req.body.subject,
        location = {
            name: req.user.username,
            id: req.user._id
        },
        coverArtURL = req.body.coverart,
    
        newBook = {title: title, publisher: publisher, author: author, isbn13: isbn13, 
                    isbn10: isbn10, unit: unit, subject: subject, location: location, coverArtURL: coverArtURL};
                    
    // Create a new Book and save to Library
    Book.create(newBook, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to Add Book
            req.flash("success", "You have added " + newlyCreated.title + " to your library");
            res.redirect("/book/new");
        }
    });
});

//NEW - Return Google Books API ISBN search results and populate Add Books Form
router.post("/new", middleware.isLoggedIn, function(req, res){
    var search = req.body.search;
  
    isbn.resolve(search, function (err, book) {
        if (err) {
            res.render("book/new", {title: null, publisher: null, author: null, isbn13: null, isbn10: null, coverArtURL: imageLink, 
                                    error: "Google Books did not return a result for ISBN: " + search});
        } else {
            var isbn13, isbn10, imageLink;
            
            // Check search result for included ISBN numbers
            if(book.industryIdentifiers.length > 0){
                if(book.industryIdentifiers[0].type === "ISBN_13"){
                    isbn13 = book.industryIdentifiers[0].identifier;
                    isbn10 = book.industryIdentifiers[1].identifier;
                } else {
                    isbn13 = book.industryIdentifiers[1].identifier;
                    isbn10 = book.industryIdentifiers[0].identifier;
                }
                // Amazon images url returns cover art more often when the ISBN:10 is available 
                imageLink = "http://images.amazon.com/images/P/" + isbn10 + ".01.20TRZZZZ.jpg";
            } else if(Object.keys(book.imageLinks).length > 0){
                // Use returned cover art url from query if no ISBN:10 is available
                imageLink = book.imageLinks.smallThumbnail;
            } else {
                // Use cover art placeholder if search results failed to produce both ISBN:10 and thumbnail url
                isbn13 = search;
                isbn10 = "";
                imageLink = "https://via.placeholder.com/175x150?text=No+Image+Available";
            }
            res.render("book/new", {
                title: book.title, publisher: book.publisher, author: book.authors, isbn13: isbn13, isbn10: isbn10, coverArtURL: imageLink,
                success: "Google Books search request info populated below"
            });
        }
    });
});

//INDEX - Show searched books result 
router.post("/search", middleware.isLoggedIn, function(req, res){
    var t = req.body.searchTitle.trim(),
        s = req.body.searchSubject.trim(),
        title = new RegExp(escapeRegExp(t), "i"),
        subject = new RegExp(escapeRegExp(s), "i");
   
    Book.find({"title": {$regex: eval(title)}, "subject": {$regex: eval(subject)}}, function(err, bookList){
       if(err){
           console.log(err);
       } else if(bookList.length > 0){
            bookList.sort((a, b) => a.title.localeCompare(b.title));
            res.render("library/index", {books: bookList, letters: letters, library: null});
       } else {
           req.flash("error", "Your search returned no results");
           res.redirect("/library/:" + req.user.username);
       }
    }
)});

module.exports = router;