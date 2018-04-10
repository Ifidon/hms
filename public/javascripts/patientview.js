  var today = new Date();
  var dd = today.getFullYear();
  var dob = document.getElementById('dob').innerHTML
  var db = new Date(dob).getFullYear();

  var age = dd - db

  document.getElementById('age').innerHTML = "Age: " + age


  function showVitalsForm() {
    var vitals = document.getElementById('vitalsform')
    if (vitals.hidden) {
      document.getElementById('vitalsform').hidden = false
    }
    else if (!vitals.hidden) {
      document.getElementById('vitalsform').hidden = true
    }

  }
