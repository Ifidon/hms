var dob  = document.getElementById('ddob').innerHTML;
// console.log(dob);

var ddob = new Date(dob);
// console.log(ddob);

var mm = ddob.getMonth() + 1;
// console.log(mm)

var dd = ddob.getDate();
// console.log(dd);

var yyyy = ddob.getFullYear();
// console.log(yyyy)

if (mm < 10) {
  mm = '0' + mm
};

if (dd < 10) {
  dd = '0' + dd
};

// console.log(mm);
// console.log(dd);

var sdob = yyyy + '-' + mm + '-' + dd;
// console.log(sdob);

document.getElementById('dob').value = sdob
