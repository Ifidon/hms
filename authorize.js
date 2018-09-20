module.exports = {
  fdaccess: function (req, res, next) {
    if(!req.user) {
      res.redirect('/login')
    }
    else if(req.user.role == "Hospital Administrator" || req.user.role == "IT Administrator") {
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
    else if(req.user.role == "Nurse" || req.user.role == "IT Administrator") {
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
    else if(req.user.role == "Doctor" || req.user.role == "IT Administrator") {
      next()
    }
    else {
      res.redirect('/unauthorized')
    }
  },

  pharmacyaccess: function (req, res, next) {
    // console.log(req.user)
    if(!req.user) {
      res.redirect('/login')
    }
    else if(req.user.role == "Pharmacist" || req.user.role == "IT Administrator") {
      next()
    }
    else {
      res.redirect('/unauthorized')
    }
  },

  labaccess: function (req, res, next) {
    // console.log(req.user)
    if(!req.user) {
      res.redirect('/login')
    }
    else if(req.user.role == "Lab Technician" || req.user.role == "IT Administrator") {
      next()
    }
    else {
      res.redirect('/unauthorized')
    }
  }
}