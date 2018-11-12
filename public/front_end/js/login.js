

var ERROR_LOG = console.error.bind(console);
var appAddr = "https://nwen304gropproject.herokuapp.com";
$(document).ready(function (e) {
	var btn_content = $('#login').text().trim();
	console.log("11111:" + btn_content);
	var localStorage = window.localStorage;
	console.log("storage: " + localStorage.getItem("email"));
	$(function () {
		if (localStorage.getItem("email") !== null && $('#login').text().trim() === "Log In") {
			console.log("log in page dectected");
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
	$('#log-in').button().click(

		function () {
			console.log("login front-end called");


			var password = $('#password').val();
			var email = $('#email').val();
			// console.log("email:"+email);
			// console.log("ps"+password);
			console.log("111111");
			if (email == null || email == undefined || email == '') {
				alert("Please enter an email address");
				return;
			} else if (password == null || password == undefined || password == '') {
				alert("Please enter a password");
				return;
			}
			else {
				$.ajax({
					method: 'POST',
					url: appAddr + "/login_account",
					data: JSON.stringify({
						pword: password,
						emailadd: email
					}),
					contentType: "application/json",
					// dataType: "json",
				}).then(my_nextfunction, ERROR_LOG);
				// window.location.href("../index.html");
				// window.close();	
			}
		});

	function my_nextfunction(accounts) {
		//add tasks:
		if (typeof accounts === "string") {
			alert(accounts);
		} else {
			accounts.forEach(account => {
				// var myStorage = window.localStorage;
				// myStorage.setItem("email", account.email);
				sessionSet("email",account.email);
				window.location.href = "../index.html";
			});
		}

	}

	// $('#google-login').button().click(
	// 	function () {
	// 		console.log("888888");
	// 		$.ajax({
	// 			method: 'GET',
	// 			url: appAddr + "/login_google",
	// 			data: JSON.stringify({
	// 				pword: "11",
	// 				emailadd: "111"
	// 			}),
	// 			contentType: "application/json",
	// 			// dataType: "json",
	// 		}).then(login_google_nextfuc,ERROR_LOG);
	// 		// }).then(loginByGoogle,ERROR_LOG);
	// 	}
	// );
	// // function loginByGoogle(url){
	// // 	window.location.href=url;
	// // }

	// function login_google_nextfuc(url){
	// 	alert(url);
	// 	window.location.href=url;
	// 	console.log(window.location.href);
	// }
	$("#search-btn").button().click(function () {
		// get the input of the search bar
		var val = $('#search').val();
		var url = appAddr + '/html/search.html?q=' + val;
		window.location.href = url;
		return false;
	});
});



