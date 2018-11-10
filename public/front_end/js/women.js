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
	items.forEach(item=>{
		var itemHTML = '<div class="items">';
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
		itemHTML += '</div>';

		var $newItem = $(itemHTML);
		$('#item-listings').prepend($newItem);
	});
}

var ERROR_LOG =console.error.bind(console);
var appAddr="https://nwen304gropproject.herokuapp.com";

$(document).ready(function(e) {

	$.ajax({
		method:'GET',
		url: "/womens",
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

	// $(".add-cart-btn").button.click(function(){
		
	// });
	var btn_content = $('#login').text().trim();
	console.log("11111:" + btn_content);
	var localStorage = window.localStorage;
	console.log("storage: " + localStorage.getItem("email"));
	$(function () {
		if (localStorage.getItem("email") !== null && $('#login').text().trim() === "Log In") {
			console.log("22222");
			$('#login').text("Log Out");
			console.log("2.11111" + $('#login').text());
		}
	});
	$("#login").button().click(function () {
		console.log("333" + $('#login').text().trim());
		if ($('#login').text().trim() === "Log Out") {
			console.log("4444");
			localStorage.clear();
			$('#login').text("Log In");

		}
		else {
			console.log("5555");
			alert("go to ")
			//  window.open("/html/login.html");
			window.location.href = "login.html";
		}
	});

	$(".add-cart-btn").button().click(function(){
		var thing = $(this).siblings();
		// grabs the item name
		var itemName = thing[2].innerHTML;
		console.log(itemName);
		$.ajax({
			method:'POST',
			url: "/add",
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify({
				add: itemName
    		})
		});
	});
});


