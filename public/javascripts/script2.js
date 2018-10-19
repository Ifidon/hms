var c1 = document.getElementById('cost1').value;
var p1 = document.getElementById('amtpaid1').value;
var b1 = document.getElementById('balance1');


function getBalance1() {

    if( c1 && p1) {
      b1.value = c1 - p1;
    }
};