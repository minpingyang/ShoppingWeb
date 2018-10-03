$(document).ready(function(e) {



	$('#submit').button().click(
		
		function() {
			// console.log("11111");
		
			var firstName= $('#firstname').val();
			var lastName = $('#lastname').val();
			var password=  $('#password').val();
			var confirmPassword =  $('#confirm_password').val();
			

			if(firstName == null || firstName == undefined || firstName == ''||lastName == null || lastName == undefined || lastName == ''||password == null || password == undefined || password == ''){
				alert("please enter a user Name and password");
			}
			else if(password !== confirmPassword){
				alert("Confirma Passwrod should be same");
				return;
			}
			else{
				var data = {'firstName':firstName,'lastName':lastName,'password':password};
				console.log(data);
				//do ajax here later
		}
	});
});
