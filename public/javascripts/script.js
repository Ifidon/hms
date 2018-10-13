function getBalance() {
    var c = document.getElementById('cost').value;
    var p = document.getElementById('amtpaid').value;
    var b = document.getElementById('balance');
    var c1 = document.getElementById('cost1').value;
    var p1 = document.getElementById('amtpaid1').value;
    var b1 = document.getElementById('balance1');
    if( c && p) {
      b.value = c - p;
      b1.value = c1 - p1;
    }
};

// if (cons) {
// 	var c = document.getElementById('cost').value;
//     var p = document.getElementById('amtpaid').value;
//     var b = document.getElementById('balance').value;

//     c = consultation.prescription.cost;
//     p = consultation.prescription.amountPaid;
//     b = consultation.prescription.balance;
// }