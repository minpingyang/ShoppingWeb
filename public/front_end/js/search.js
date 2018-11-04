// function sortButtonCss(element){
//   $(".sort-options").css({
//     "background-color" : "white",
//     "color" : "black"
//   });

//   element.style.backgroundColor = "black";
//   element.style.color = "white";
// }

// function sortMostPopular(element){
//   sortButtonCss(element);
  
// 	$.ajax({
// 		method:'GET',
// 		url: "/mens_most_popular",
// 		contentType: "application/json",
// 		dataType: "json",
// 		success: function(){
// 			$("#item-listings").empty();
// 		}
// 	}).then(create_items, ERROR_LOG);
// };

// function sortPriceAscending(element){
//   sortButtonCss(element);

// 	$.ajax({
// 		method:'GET',
// 		url: "/mens_price_ascending",
// 		contentType: "application/json",
// 		dataType: "json",
// 		success: function(){
// 			$("#item-listings").empty();
// 		}
// 	}).then(create_items, ERROR_LOG);
// };

// function sortPriceDescending(element){
//   sortButtonCss(element);

// 	$.ajax({
// 		method:'GET',
// 		url: "/mens_price_descending",
// 		contentType: "application/json",
// 		dataType: "json",
// 		success: function(){
// 			$("#item-listings").empty();
// 		}
// 	}).then(create_items, ERROR_LOG);  
// };

var data;

/* Create the database records on the html file */
function create_items(items){
	// change the footer position if there are items
	if(items.length != 0){
		$('footer').removeClass('bottom');
	}

	var searchHTML = '<p>Searching: ' + data + '</p>';
	searchHTML += '<p>Results: ' + items.length + '</p>';
	var $newSearch = $(searchHTML);
	$('.searching').prepend($newSearch);

	items.forEach(item=>{
		var n = item.item_name.search(data);
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

		// highlights the searched string in bold
		itemHTML += '<p>'
		for(var i = 0; i < item.item_name.length; i++){
			if(i === n){
				itemHTML += '<b>';
				for(var j = i; j < (i+data.length); j++){
					itemHTML += item.item_name[j];
				}
				itemHTML += '</b>';
				i += data.length - 1;
			}
			else{
				itemHTML += item.item_name[i];
			}
		}
		itemHTML += '</p>';
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
	var url = document.location.href;
	var params = url.split('?')[1];
	console.log('url= ' + url);
	console.log('params= ' + params);
	var decodedParams = decodeURIComponent(params);
	data = decodeURIComponent(params.split('=')[1]);

	console.log('decodedParams= ' + decodedParams);
	console.log('data= '+data);

	$.ajax({
		method:'POST',
		url: '/search',
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify({
			q: data
    	}),
	}).then(create_items, ERROR_LOG);


	$("#search-btn").button().click(function(){
		// get the input of the search bar
		var val = $('#search').val();
		var url = appAddr + '/html/search.html?q=' + val;
		window.location.href = url;
		return false;
	});

});


