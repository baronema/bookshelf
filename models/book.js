var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
   title: String,
   publisher: String,
   author: String,
   isbn13: String,
   isbn10: String,
   unit: String,
   subject: String,
   location: {
         name: {
                  type: String,
                  required: true
               },
         id:   {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Classroom",
                  required: true
               }
   },
   checkedLoc: {
         name: {
                  type: String,
                  default: "N/A"
               },
         id:   {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Borrowed Classroom",
               },
         borrowed: {
                     type: Boolean,
                     default: false
                   }
   },
   coverArtURL: 
      { 
         type: String,
         default: "https://via.placeholder.com/175x150?text=No+Image+Available"
      }
});

module.exports = mongoose.model("Book", bookSchema);