

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
  var btn_content = $('#login').text().trim();
  console.log("11111:"+btn_content);
  var localStorage = window.localStorage;
  console.log("storage: "+localStorage.getItem("email"));
  $(function () {
    // var localStorage = window.localStorage;
    // if($('#login').find("text").text().trim()==="Log Out"){
    //     $('#login').attr("href", "../index.html");
    // }else if(localStorage["email"]){
    //   var name = localStorage.getItem("email")
    //   $('#login').text("Log Out");
      
    // }
    if(localStorage.getItem("email")!==null&&btn_content==="Log In"){
      console.log("22222");
      $('#login').text("Log Out");
    }
  });
  $("#login").button().click(function(){
    console.log("333"+btn_content);
    if(btn_content==="Log Out"){
      console.log("3333");
      localStorage.clear();
      $('#login').text("Log In");
     
    }
    else{
    console.log("44444");
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
