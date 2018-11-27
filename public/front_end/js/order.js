var appAddr = "https://nwen304gropproject.herokuapp.com";
var ERROR_LOG =console.error.bind(console);
var email = sessionGet('email');
console.log(email);

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

function create_items(items){
	console.log('items=' + items);
	if(email == 'admin@gmail.com'){
		var headerHTML = '<tr>';
		headerHTML += '<th>Order Id</th>'
		headerHTML += '<th>Date Ordered</th>'
		headerHTML += '<th>Item</th>'
		headerHTML += '<th>Price</th>'
		headerHTML += '<th>Quantity</th>'
		headerHTML += '<th>Email</th>'
		headerHTML += '<th><button type="submit" id="save-btn">Save Orders</button></th>'
		headerHTML += '</tr>'
		var $newItem = $(headerHTML);
		$('#order-info').prepend($newItem);
		items.forEach(item=>{
			var orderHTML = '<tr>';
			orderHTML += '<td>' + item.order_id + '</td>';
			orderHTML += '<td>' + item.order_date + '</td>';
			orderHTML += '<td>' + item.item_name + '</td>';
			orderHTML += '<td>' + item.price + '</td>';
			orderHTML += '<td>' + item.quantity + '</td>';
			orderHTML += '<td>' + item.email + '</td>';
			orderHTML += '<td><button type="submit" id="cancel-btn">Cancel</button></td>';
			var $newItem = $(orderHTML);
			$('#order-list').prepend($newItem);
		});
	}
	else{
		var headerHTML = '<tr>';
		headerHTML += '<th>Order Id</th>'
		headerHTML += '<th>Date Ordered</th>'
		headerHTML += '<th>Item</th>'
		headerHTML += '<th>Price</th>'
		headerHTML += '<th>Quantity</th>'
		headerHTML += '</tr>'
		var $newItem = $(headerHTML);
		$('#order-info').prepend($newItem);

		items.forEach(item=>{
			var orderHTML = '<tr>';
			orderHTML += '<td>' + item.order_id + '</td>';
			orderHTML += '<td>' + item.order_date + '</td>';
			orderHTML += '<td>' + item.item_name + '</td>';
			orderHTML += '<td>' + item.price + '</td>';
			orderHTML += '<td>' + item.quantity + '</td>';
			var $newItem2 = $(orderHTML);
			$('#order-list').prepend($newItem2);
		});
	}
}

$(document).ready(function (e) {

  // add the order history button if user is logged in
  if(sessionGet('email') != null) {
    var html = '<li class="float-right">';
    html += '<a href="html/order.html">Order History</a>';
    html += '</li>';
    var button = $(html);
    $('#nav1').prepend(button);

    $.ajax({
		method:'POST',
		url: "/get_orders",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify({
			emailadd: email
		})
	}).then(create_items, ERROR_LOG);
  }

  // if the account is the admin account
  $(document).on("click","#cancel-btn", function(){
  	var row = $(this).parent().siblings();
  	var json = [];
  	var data = {};
  	data['order_id'] = Number(row[0].innerHTML);
  	data['email'] = row[5].innerHTML;
  	json.push(data);
  	console.log('json=' + JSON.stringify(json));

  	$.ajax({
		method:'DELETE',
		url: "/delete_order",
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(json),
	});
  });


  // $(document).on("click","#save-btn", function(){
 //  	$.ajax({
	// 	method:'DELETE',
	// 	url: "/save_orders",
	// 	contentType: "application/json",
	// 	dataType: "json"
	// });
  // });




}); 