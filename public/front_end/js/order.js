var appAddr = "https://nwen304gropproject.herokuapp.com";

$(document).ready(function (e) {

  // add the order history button if user is logged in
  if(window.localStorage != null) {
    var html = '<li class="float-right">';
    html += '<a href="html/order.html">Order History</a>';
    html += '</li>';
    var button = $(html);
    $('#nav1').prepend(button);

    var email = window.localStorage.getItem("email");
    
  }


}); 