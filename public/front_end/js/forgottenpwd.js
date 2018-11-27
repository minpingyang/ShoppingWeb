var appAddr="https://nwen304gropproject.herokuapp.com";
var ERROR_LOG = console.error.bind(console);
$(document).ready(function (e) {

  $('#reset-password').click(

    function () {
      console.log("forgot js called");
      // console.log("location:"+window.location.pathname);
      var email = $('#email').val();

      if (email == null || email == undefined || email == '') {
        alert("Please enter an email address");
        return;
      }
      else {

        $.ajax({
          method: 'POST',
          url: appAddr + "/forgot_pwd",
          data: JSON.stringify({
            emailadd: email
          }),
          contentType: "application/json"
          // dataType: "json",
        }).then(function (accounts) {
          console.log("accounts: "+accounts);
          if ( accounts == "sent") {
            alert("Email was sent");
          }else{
            alert(accounts);
          }
        }, ERROR_LOG);
        // window.location.href("../index.html");
        // window.close();

      }

    }
  );
  // var btn_content = $('#login').text().trim();
  // console.log("11111:"+btn_content);
  // var localStorage = window.localStorage;
  // console.log("storage: "+localStorage.getItem("email"));
  // $(function () {
  //   if(localStorage.getItem("email")!==null&&$('#login').text().trim()==="Log In"){
  //     console.log("22222");
  //     $('#login').text("Log Out");
  //     console.log("2.11111"+$('#login').text());
  //   }
  // });
  // $("#login").button().click(function(){
  //   console.log("333"+$('#login').text().trim());
  //   if($('#login').text().trim()==="Log Out"){
  //     console.log("4444");
  //     localStorage.clear();
  //     $('#login').text("Log In");

  //   }
  //   else{
  //   console.log("5555");
  //    alert("go to ")
  //   //  window.open("/html/login.html");
  //     window.location.href="login.html";
  //   }
  // });
  // $("#search-btn").button().click(function(){
  //   // get the input of the search bar
  //   var val = $('#search').val();
  //   var url = appAddr + '/html/search.html?q=' + val;
  //   window.location.href = url;
  //   return false;
  // });

});