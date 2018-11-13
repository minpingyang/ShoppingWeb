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

function sessionGet(key) {
    let stringValue = window.sessionStorage.getItem(key)
    if (stringValue !== null) {
      let value = JSON.parse(stringValue)
      let expirationDate = new Date(value.expirationDate)
      if (expirationDate > new Date()) {
        return value.value
      } else {
        window.sessionStorage.removeItem(key)
      }
    }
    return null
  }

  var email = sessionGet('email');

var ERROR_LOG =console.error.bind(console);
var appAddr="https://nwen304gropproject.herokuapp.com";
// var email = window.localStorage.getItem("email");
var email = sessionGet('email');

console.log('email=' + email);

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

	

	$("#search-btn").button().click(function(){
		// get the input of the search bar
		var val = $('#search').val();
		var url = appAddr + '/html/search.html?q=' + val;
		window.location.href = url;
		return false;
	});

		


	// create json data and send it to the server
	$(document).on("click","#purchase-btn", function(){
		var json = {};
		var products = $('.product-details').children;
		products.forEach(product=>{
			var itemName = product[0].innerHTML;
			var price = product[1].innerHTML;
			var quantity = product[2].innerHTML;
			var row = {};
			row['item_name'] = itemName;
			row['price'] = price;
			row['quantity'] = quantity; 
			json.push(row);
		});

		console.log(json);
		


		// $.ajax({
		// 	method:'POST',
		// 	url: "/order",
		// 	contentType: "application/json",
		// 	dataType: "json",
		// 	data: json
		// });

		// window.location.href = '../html/order.html';
	});

});


