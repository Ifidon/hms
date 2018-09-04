module.exports = {
  fdaccess: function (req, res, next) {
    if(!req.user) {
      res.redirect('/login')
    }
    else if(req.user.role == "Hospital Administrator") {
      next()
    }
    else {
      res.send('Not Authorized to view this page')
    }
  },


  nurseaccess: function (req, res, next) {
    // console.log(req.user)
    if(!req.user) {
      res.redirect('/login')
    }
    else if(req.user.role == "Nurse") {
      next()
    }
    else {
      res.send('Not Authorized to view this page')
    }
  },

  draccess: function (req, res, next) {
    // console.log(req.user)
    if(!req.user) {
      res.redirect('/login')
    }
    else if(req.user.role == "Doctor") {
      next()
    }
    else {
      res.send('Not Authorized to view this page')
    }
  },

  pharmlabaccess: function (req, res, next) {
    // console.log(req.user)
    if(!req.user) {
      res.redirect('/login')
    }
    else if(req.user.role == "Pharmacist" ||  req.user.role == "Lab Technician") {
      next()
    }
    else {
      res.send('Not Authorized to view this page')
    }
  }
}