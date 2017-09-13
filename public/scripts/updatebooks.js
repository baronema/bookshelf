// INPUT VALIDATION FOR EDITING BOOKS
function editBook() {
    var title = document.forms["editbook"]["title"].value,
        publisher = document.forms["editbook"]["publisher"].value,
        author = document.forms["editbook"]["author"].value,
        isbn13 = document.forms["editbook"]["isbn13"].value,
        isbn10 = document.forms["editbook"]["isbn10"].value;
        
        if(title == (null || '')){
            alert("Warning: Book Must Have A Title");
            return false;
        } else if(publisher == (null || '')){
            if(author == (null | '')){
                alert("Warning: Book Must Have An Author or Publisher");
                return false;
            }
        }
        
        if(!(/^(?=(?:.{0}|.{10})$)[0-9]*$/.test(isbn10))){
            alert("Warning: ISBN:10 Improperly Formatted");
            return false;
        } else if(!(/^(?=(?:.{0}|.{13})$)[0-9]*$/.test(isbn13))){
            alert("Warning: ISBN:13 Improperly Formatted");
            return false;
        }
        
        return true; // return true to submit form
}

