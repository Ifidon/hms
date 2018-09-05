module.exports = {
  fdaccess: function (req, res, next) {
    if(!req.user) {
      res.redirect('/login')
    }
    else if(req.user.role == "Hospital Administrator") {
      next()
    }
    else {
      res.redirect('/unauthorized')
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
      res.redirect('/unauthorized')
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
      res.redirect('/unauthorized')
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
      res.redirect('/unauthorized')
    }
  }
}