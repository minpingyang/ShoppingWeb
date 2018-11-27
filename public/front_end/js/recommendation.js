/* Create the database records on the html file */
function create_items(items) {
	items.forEach(item => {
		var itemHTML = '<li class="items">';
		itemHTML += '<img src="' + item.img + '" class="img-width">';
		itemHTML += '<p>';
		for (var i = 0; i < 5; i++) {
			if (i < item.rating) {
				itemHTML += '<i class="fas fa-star"></i>';
			}
			else {
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

var ERROR_LOG = console.error.bind(console);
var appAddr = "https://nwen304gropproject.herokuapp.com";
var email = sessionGet('email');
$(document).ready(function (e) {
	console.log(email);

	$.ajax({
		method: 'POST',
		url: "/recommendations",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify({
			email: email
		})
	}).then(create_items, ERROR_LOG);

	$("#search-btn").button().click(function () {
		// get the input of the search bar
		var val = $('#search').val();
		console.log(val);
		var url = appAddr + '/html/search.html?q=' + val;
		window.location.href = url;
		return false;
	});

	// add the order history button if user is logged in
	if(sessionGet('email') != null) {
		var html = '<li class="float-right">';
		html += '<a href="html/order.html">Order History</a>';
		html += '</li>';
		var button = $(html);
		$('#nav1').prepend(button);

		var html2 = '<li class="float-right">';
		html2 += '<a href="html/recommendations.html">Recommendations</a>';
		html2 += '</li>';
		var button2 = $(html2);
		$('#nav1').prepend(button2);
	}


});


