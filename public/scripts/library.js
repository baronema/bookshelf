$(document).ready(function() {

/*global $*/

// Attach a delegated event handler for showing/hiding extended book info when selected
$( ".list" ).on( "click", function(event) {
	var extendedInfo = this.querySelectorAll('.extended'),
		container = this.querySelector('.info_container');
		
	container.classList.toggle('column');
	this.classList.toggle("extended_style");
    $(extendedInfo).toggle();
});

// Attach a delegated event handler for filtering booklist by first letter of book title
$( ".letter" ).on( "click", function( event ) {
	var filter = this.textContent.toUpperCase();
	
	if(filter === "ALL"){
		$('.clear').each(function(){
			$(this).show();
		})
	} else {
		$('.clear').each(function(){
			$(this).hide();
		})
		$('#id_' + filter).show();
	}
});

})




