

function changePic(n) {
    
    var slides = document.getElementsByClassName("slideshow-imgs");
    var dots = document.getElementsByClassName("dot");

    // changes which dot is active, active dot is white and dark border, inactive is grey
    for (var i = 0; i < dots.length; i++) {
      if(i === n){
        dots[i].className = dots[i].className.replace(" inactiveDot", " activeDot");
      }
      else{
        dots[i].className = dots[i].className.replace(" activeDot", " inactiveDot");
      }
    }

    // hides all images by initially
    for (var i = 0; i < slides.length; i++) {
       slides[i].style.display = "none";  
    }  
    
    // set the image corresponding to the dot on display
    slides[n].style.display = "block"; 
}

var appAddr="https://nwen304gropproject.herokuapp.com";

$(document).ready(function(e){
  var btn_content = $('#login').find("text").text().trim();
  console.log("999:"+btn_content);
  $(function () {
    // var localStorage = window.localStorage;
    // if($('#login').find("text").text().trim()==="Log Out"){
    //     $('#login').attr("href", "../index.html");
    // }else if(localStorage["email"]){
    //   var name = localStorage.getItem("email")
    //   $('#login').text("Log Out");
      
    // }
    if(localStorage["email"]&&btn_content==="Log In"){
      console.log("66666666");
      $('#login').text("Log Out");
    }
  });
  $("#login").button().click(function(){
    
    if($('#login').find("text").text().trim()==="Log Out"){
      localStorage.clear();
      $('#login').text("Log In");
    }
    else{
     alert("go to ")
    //  window.open("/html/login.html");
      window.location.href="html/login.html";
    }
  });
  $("#search-btn").button().click(function(){
    // get the input of the search bar
    var val = $('#search').val();
    var url = appAddr + '/html/search.html?q=' + val;
    window.location.href = url;
    return false;
  });
});
