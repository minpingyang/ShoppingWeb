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
		url: "/new_most_popular",
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
		url: "/new_price_ascending",
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
		url: "/new_price_descending",
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
var appAddr="https://privatenwen304.herokuapp.com.herokuapp.com";

$(document).ready(function(e) {

	$.ajax({
		method:'GET',
		url: "/new",
		contentType: "application/json",
		dataType: "json"
	}).then(create_items, ERROR_LOG);

	var searching = $('#search').val();

	$("#search-btn").button().click(function(){
		$.ajax({
			method:'GET',
			url: "/search",
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify({
				search: searching
        	}),
			success: function(items){
				window.location.href="../search.html#result_"+items.length;
			}
		}).then(create_items, ERROR_LOG);
	});

});


