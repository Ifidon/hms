var express = require('express');
var mongoose = require('mongoose');
var Patients =  require('../models/consultations');


var consultationRouter = express.Router();


consultationRouter.route('/')
