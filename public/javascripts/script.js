var c = document.getElementById('cost').value;
var p = document.getElementById('amtpaid').value;
var b = document.getElementById('balance');


function getBalance() {
    if( c && p) {
      b.value = c - p;
    }
};