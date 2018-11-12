




$(document).ready(function(e) {
	var appAddr="https://nwen304gropproject.herokuapp.com";
	$('#password').keyup(function () {
		var password=  $('#password').val();
		var strengthBar =document.getElementById("strength")
		var strength=0;

		if ((password.match(/[a-z]/)) && (password.match(/[A-Z]/))) {
			strength+=1;
		}
		if (password.match(/.[,!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) {
			strength+=1;
		}
		if (password.match(/[0-9]/)) {
			strength+=1;
		}
		if (password.length>5) {
			strength+=1;
		}
		switch(strength){
			case 0:
				strengthBar.value=20;
				break;
			case 1:
				strengthBar.value=40;
				break;
			case 2:
				strengthBar.value=60;
				break;
			case 3:
				strengthBar.value=80;
				break;
			case 4:
				strengthBar.value=100;
				break;
			
		}
	})
	$('#create-account').click(
		function() {
			console.log("register js called");
			console.log("location:"+window.location.pathname);
			var firstName= $('#firstname').val()
			var lastName = $('#lastname').val();
			var password=  $('#password').val();
			var email = $('#email').val();
			var confirmPassword =  $('#confirm_password').val();
			console.log("firstName:"+firstName);
			console.log("lastName:"+lastName);
			console.log("ps:"+password);
			console.log("c_ps:"+confirmPassword);
			console.log("email"+email);

			if(email == null || email == undefined || email == ''){
				alert("Please enter an email address");
				return;
			}else if(firstName == null || firstName == undefined || firstName == ''||lastName == null || lastName == undefined || lastName == ''){
				alert("Please enter your full name");
				return;
			}else if(password == null || password == undefined || password == ''){
				alert("Please enter a password");
				return;
			}
			else if(password !== confirmPassword){
				alert("Passwords do not match");
				return;
			}
			else{				
				$.ajax({	
					method:'POST',
					url: appAddr+"/register",
					data: JSON.stringify({
						fname: firstName,
						lname: lastName,
						pword: password,
						emailadd: email
                	}),
	                contentType: "application/json",
	                dataType: "json",
				});
				// window.location.href("../index.html");
				// window.close();
				// window.open("../index.html","_self");
				alert("Register Successfullly");
				window.location.href="/login.html";
			}
	});

	$("#search-btn").button().click(function(){
		// get the input of the search bar
		var val = $('#search').val();
		var url = appAddr + '/html/search.html?q=' + val;
		window.location.href = url;
		return false;
	});
	var btn_content = $('#login').text().trim();
	console.log("11111:" + btn_content);
	var localStorage = window.localStorage;
	console.log("storage: " + localStorage.getItem("email"));
	$(function () {
		if (localStorage.getItem("email") !== null && $('#login').text().trim() === "Log In") {
			console.log("22222");
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
});
