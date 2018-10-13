$(document).ready(function(e) {


	var appAddr="https://nwen304gropproject.herokuapp.com";
	$('#log-in').button().click(
		
		function() {
			console.log("login js called");
		
	
			var password=  $('#password').val();
			var email = $('#email').val();
            console.log("email:"+email);
            console.log("ps"+password);
			
			if(email == null || email == undefined || email == ''){
                alert("Please enter an email address");
                return;
			}else if(password == null || password == undefined || password == ''){
                alert("Please enter a password");
                return;
            }
			else{
				$.ajax({	
					method:'POST',
					url: appAddr+"/html/login.html",
					data: JSON.stringify({
						pword: password,
						emailadd: email
                	}),
	                contentType: "application/json",
	                dataType: "json",
	                success: function(data){
	                	if(data.length != 0){
	                		window.open("../index.html","_self");
							alert("Login Successfullly");
	                	}
	                	else if(data.length == 0){
	                		alert("Incorrect email / password");
	                	}
	                }
				});
				// window.location.href("../index.html");
				// window.close();

				
			}
	});
});
