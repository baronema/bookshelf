// INPUT VALIDATION FOR GOOGLE BOOKS API SEARCH
function submitISBN() {
    
    var ans = document.forms["isbnSearch"]["search"].value;

    if (/^([0-9]{10})$/.test(ans) || /^([0-9]{13})$/.test(ans)){
		return true;
	} else {
		alert("Warning: ISBN Search Must be either 10 or 13 digits only (*no spaces, dashes, etc.*");
		return false; // return false to cancel form action
	}
}

// INPUT VALIDATION FOR ADDING BOOKS 
function addBook() {
    var title = document.forms["addbook"]["title"].value,
        publisher = document.forms["addbook"]["publisher"].value,
        author = document.forms["addbook"]["author"].value,
        isbn13 = document.forms["addbook"]["isbn13"].value,
        isbn10 = document.forms["addbook"]["isbn10"].value;
        
        if(title == (null || '')){
            alert("Warning: Added Book Must Have A Title");
            return false;
        } else if(publisher == (null || '')){
            if(author == (null | '')){
                alert("Warning: Added Book Must Have An Author or Publisher");
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