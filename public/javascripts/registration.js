
var id = document.getElementById('patient_id')
var n  = parseInt(last.patient_id) + 1
tid = '000000' + n
id.value = tid.slice(-6)