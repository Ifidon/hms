var adminbar = document.getElementById('loginbar')
var login = document.getElementById('loginlink')
var hist = document.getElementById('historylink')

if (use) {
	login.innerHTML= 'Logged in as @' + use + ' (Logout)';
    login.href = '/users/logout';
    hist.hidden = false
}