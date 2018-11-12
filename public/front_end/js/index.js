

function changePic(n) {

  var slides = document.getElementsByClassName("slideshow-imgs");
  var dots = document.getElementsByClassName("dot");

  // changes which dot is active, active dot is white and dark border, inactive is grey
  for (var i = 0; i < dots.length; i++) {
    if (i === n) {
      dots[i].className = dots[i].className.replace(" inactiveDot", " activeDot");
    }
    else {
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

var appAddr = "https://nwen304gropproject.herokuapp.com";

$(document).ready(function (e) {
  // get from session (if the value expired it is destroyed)
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

  // add into session
  function sessionSet(key, value, expirationInMin = 1) {
    let expirationDate = new Date(new Date().getTime() + (60000 * expirationInMin))
    let newValue = {
      value: value,
      expirationDate: expirationDate.toISOString()
    }
    window.sessionStorage.setItem(key, JSON.stringify(newValue))
    timeOutFunc(expirationInMin*1000*60);
  }
  function timeOutFunc(timeExpir){
    setTimeout(function(){
      alert("Time out need to login again");
      sessionSet("google", "false");
      sessionSet("email",null);
      window.location.reload();
    },timeExpir
    );
  }
  // var localStorage = window.localStorage;
  // console.log("storage: " + localStorage.getItem("email"));
  $(function () {
    if (sessionGet("google") === "true") {
      $('#login_google').text("Log Out Gooogle");
    } else if (sessionGet("google") === "false") {
      $('#login_google').text("Log In by Gooogle");
    }
    if (sessionGet("email") !== null && $('#login').text().trim() === "Log In") {
      console.log("log In...........");
      $('#login').text("Log Out");
    }


  });
  $("#login").button().click(function () {
    console.log("333" + $('#login').text().trim());
    if ($('#login').text().trim() === "Log Out") {
      console.log("4444");
      // localStorage.clear();
      sessionSet("email",null);
      $('#login').text("Log In");

    }
    else {
      console.log("5555");
      alert("go to ")
      //  window.open("/html/login.html");
      window.location.href = "html/login.html";
    }
  });
  $("#login_google").button().click(function () {

    if ($('#login_google').text().trim() === "Log Out Gooogle") {
    
      // var ifGoogle = window.localStorage;
      // ifGoogle.setItem("google", "false");
      sessionSet("google", "false");
      // $('#login_google').text("Log In");
      window.location.href = "/logout_google";

    }
    else {
  
      alert("go to ");
      // var ifGoogle = window.localStorage;
      // ifGoogle.setItem("google", "true");
      sessionSet("google", "true");
      window.location.href = "/login_google";
    }
  });
  $("#search-btn").button().click(function () {
    // get the input of the search bar
    var val = $('#search').val();
    var url = appAddr + '/html/search.html?q=' + val;
    window.location.href = url;
    return false;
  });

});
