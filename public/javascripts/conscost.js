function getPrescriptionBalance() {
    var c = document.getElementById('pcost').value;
    var p = document.getElementById('pamountPaid').value;
    var b = document.getElementById('pbalance');
    if( c && p) {
      b.value = c - p;
    }
};

  function getLabBalance() {
    var c = document.getElementById('tcost').value;
    var p = document.getElementById('tamountPaid').value;
    var b = document.getElementById('tbalance');
    if( c && p) {
      b.value = c - p;
    }
  }
