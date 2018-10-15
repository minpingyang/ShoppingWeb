var ERROR_LOG =console.error.bind(console);
var appAddr="https://nwen304gropproject.herokuapp.com";
$(document).ready(function(e) {
    $('#confirm').click(
		
		function() {
			console.log("reset js called");
			// console.log("location:"+window.location.pathname);
			var email = $('#email').val();
            var old_password=  $('#old-password').val();
            var new_password = $('#new-password').val();
			var confirmPassword =  $('#confirm-new-password').val();

			if(email == null || email == undefined || email == ''){
				alert("Please enter an email address");
				return;
			}else if(old_password == null || old_password== undefined || old_password == ''){
				alert("Please enter your old password");
				return;
			}else if(new_password == null || new_password == undefined || new_password == ''){
				alert("Please enter a password");
				return;
			}
			else if(new_password !== confirmPassword){
				alert("Confirm New Passwords does not match");
				return;
			}
			else{
				
				
				$.ajax({	
					method:'PUT',
					url: appAddr+"/reset_pwd",
					data: JSON.stringify({
						old_pword: old_password,
						new_pword: new_password,
						emailadd: email
                	}),
	                contentType: "application/json",
	                dataType: "json",
				}),then(function(){
					alert("reset successfully");
				},function(error){
					alert(error);
				});
				// window.location.href("../index.html");
				// window.close();

				window.open("../login.html","_self");
				alert("Reset Successfullly");
				
				

			}

		}
	);
	
	
	
	
	
});