



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
	
				$.ajax({	
					method:'POST',
					url: appAddr+"/register",
					data: JSON.stringify({
						fname: firstname.text(),
						lname: lastname.text(),
						pword: password.text(),
						emailadd: email.text()
                	}),
	                contentType: "application/json",
	                dataType: "json",
				});
				// window.location.href("../index.html");
				// window.close();
				window.open("../index.html","_self");
				
				

			}

	});

});
