$(document).ready(function(e) {



	$('#submit').button().click(
		
		function() {
			console.log("login js called");
		
	
			var password=  $('#password').val();
			var email = $('#email').val();
            console.log("email:"+email);
            console.log("ps"+password);
            console.log("22222");
			if(email == null || email == undefined || email == ''){
                alert("Please enter an email address");
                return;
			}else if(password == null || password == undefined || password == ''){
                alert("Please enter a password");
                return;
            }
			else{
				var data = {'password':password,'email':email};
				console.log(data);
				//do ajax here later
		}
	});
});
