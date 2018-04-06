var today = new Date();
var createDate = new Date(document.getElementById('consdate').innerHTML);
console.log(today);
console.log(createDate);

var tdd = today.getDate()
var tmm = today.getMonth() + 1
var tyy = today.getFullYear()
if (tdd <10) {
  tdd = '0' + tdd
}

if (tmm < 10) {
  tmm = '0' + tmm
}

today = tmm + '/' + tdd + '/' + tyy
console.log(today)

var cdd = createDate.getDate()
var cmm = createDate.getMonth() + 1
var cyy = createDate.getFullYear()
if (cdd <10) {
  cdd = '0' + cdd
}

if (cmm < 10) {
  cmm = '0' + cmm
}

createDate = cmm + '/' + cdd + '/' + cyy
console.log(createDate)
