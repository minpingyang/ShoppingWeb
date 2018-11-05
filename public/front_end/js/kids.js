function sortButtonCss(element){
  $(".sort-options").css({
    "background-color" : "white",
    "color" : "black"
  });

  element.style.backgroundColor = "black";
  element.style.color = "white";
}

function sortMostPopular(element){
  sortButtonCss(element);
  
	$.ajax({
		method:'GET',
		url: "/kids_most_popular",
		contentType: "application/json",
		dataType: "json",
		success: function(){
			$("#item-listings").empty();
		}
	}).then(create_items, ERROR_LOG);
};

function sortPriceAscending(element){
  sortButtonCss(element);

	$.ajax({
		method:'GET',
		url: "/kids_price_ascending",
		contentType: "application/json",
		dataType: "json",
		success: function(){
			$("#item-listings").empty();
		}
	}).then(create_items, ERROR_LOG);
};

function sortPriceDescending(element){
  sortButtonCss(element);

	$.ajax({
		method:'GET',
		url: "/kids_price_descending",
		contentType: "application/json",
		dataType: "json",
		success: function(){
			$("#item-listings").empty();
		}
	}).then(create_items, ERROR_LOG);  
};

/* Create the database records on the html file */
function create_items(items){
	items.forEach(item=>{
		var itemHTML = '<li class="items">';
		itemHTML += '<img src="' + item.img + '" class="img-width">';
		itemHTML += '<p>';
		for(var i = 0; i < 5; i++){
			if(i < item.rating){
				itemHTML += '<i class="fas fa-star"></i>';
			}
			else{
				itemHTML += '<i class="far fa-star"></i>';
			}
		}
		itemHTML += '</p>';
		itemHTML += '<p>' + item.item_name + '</p>';
		itemHTML += '<p><i class="fas fa-dollar-sign"></i>' + item.price + '</p>';
		itemHTML += '<button class="add-cart-btn">Add to Cart</button>';
		itemHTML += '</li>';

		var $newItem = $(itemHTML);
		$('#item-listings').prepend($newItem);
	});
}

var ERROR_LOG =console.error.bind(console);
var appAddr="https://nwen304gropproject.herokuapp.com";

$(document).ready(function(e) {

	$.ajax({
		method:'GET',
		url: "/kids",
		contentType: "application/json",
		dataType: "json"
	}).then(create_items, ERROR_LOG);

	$("#search-btn").button().click(function(){
		// get the input of the search bar
		var val = $('#search').val();
		var url = appAddr + '/html/search.html?q=' + val;
		window.location.href = url;
		return false;
	});

});


