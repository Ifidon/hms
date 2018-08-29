var password = document.getElementById('passw');
var confirmp = document.getElementById('confpass');
var message = document.getElementById('message');

function checkpass() {
	if (password.value != confirmp.value) {
		confirmp.value = '';
		message.hidden = false;
		message.innerHTML = 'Password does not match! Try again';
	}
}