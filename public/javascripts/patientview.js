  var today = new Date();
  var dd = today.getFullYear();
  var dob = document.getElementById('dob').innerHTML
  var db = new Date(dob).getFullYear();

  var age = dd - db

  document.getElementById('age').innerHTML = "Age: " + age


  function showVitalsForm() {
    document.getElementById('vitalsform').hidden = false
  }
