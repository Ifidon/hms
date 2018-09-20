function getBalance() {
    var c = document.getElementById('cost').value;
    var p = document.getElementById('amtpaid').value;
    var b = document.getElementById('balance');
    if( c && p) {
      b.value = c - p;
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