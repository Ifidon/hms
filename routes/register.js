var express = require('express');
var mongoose = require('mongoose');
var Patients =  require('../models/patients');

var router = express.Router()

router.route('/')
.get((req, res, next)=> {
	res.render('newuser')
})

module.exports = router;