$(document).ready(function(e) {



	$('#create-account').click(
		
		function() {
			console.log("register js called");
			console.log("location:"+window.location.pathname);
			var firstName= $('#firstname').val();
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
				alert("please enter a email address");
				return;
			}else if(firstName == null || firstName == undefined || firstName == ''||lastName == null || lastName == undefined || lastName == ''){
				alert("please enter your full name");
				return;
			}else if(password == null || password == undefined || password == ''){
				alert("please enter a password");
				return;
			}
			else if(password !== confirmPassword){
				alert("Confirma Passwrod should be same");
				return;
			}
			else{
				// window.location="../index.html";
				var data = {'firstName':firstName,'lastName':lastName,'password':password,'email':email};
				console.log(data);
				//do ajax here later
				$.ajax({	
					method:'POST',
					// url: ipAddr+"/newUser",
					data: data,
    				//url: ipAddr+"/test",
    				error: function(data,status) {
    					alert("failed Register: " + status);
    				},
    				success: function(data,status){
    					alert("succesful Register: " + status);
						window.location.href = "../index.html";
    				}
    			});

			}

	});

});
