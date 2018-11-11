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
		url: "/womens_most_popular",
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
		url: "/womens_price_ascending",
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
		url: "/womens_price_descending",
		contentType: "application/json",
		dataType: "json",
		success: function(){
			$("#item-listings").empty();
		}
	}).then(create_items, ERROR_LOG);  
};

/* Create the database records on the html file */
function create_items(items){
	console.log('items=' + items);
	items.forEach(item=>{
		var itemHTML = '<div class="product">';
		itemHTML += '<img src="' + item.img + '" class="img-size">';
		itemHTML += '<div class="product-description">';
		itemHTML += '<div class="product-details">';
		itemHTML += '<p>' + item.item_name + '</p>';
		itemHTML += '<p>$' + item.price + '</p>';
		itemHTML += '<p>Quantity: ' + item.quantity + '</p>';
		itemHTML += '</div>';

		itemHTML += '<div class="remove-item">';
		itemHTML += '</div>';
		itemHTML += '</div>';
		itemHTML += '</div>';

		var $newItem = $(itemHTML);
		$('#product-list').prepend($newItem);
	});
}

// <div class="product">
// 	<img src="../image/W-Boots1.jpg" class="img-size">
// 	<div class="product-description">
// 		<div class="product-details">
// 			<p>Product Name</p>
// 			<p>Price: $30</p>
// 			<p>Quantity: 5</p>
// 		</div>
		

// 		<div class="remove-item">
			
// 		</div>
// 	</div>
// </div>

var ERROR_LOG =console.error.bind(console);
var appAddr="https://nwen304gropproject.herokuapp.com";
var email = window.localStorage.getItem("email");

$(document).ready(function(e) {

	$.ajax({
		method:'POST',
		url: "/view_cart",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify({
			email: email
		})
	}).then(create_items, ERROR_LOG);

	var searching = $('#search').val();

	$("#search-btn").button().click(function(){
		// get the input of the search bar
		var val = $('#search').val();
		var url = appAddr + '/html/search.html?q=' + val;
		window.location.href = url;
		return false;
	});

});


