var express 		 = require('express');
var router 			 = express.Router();
var createDriverCtrl = require('../js/driver.js');
var updateDriverCtrl = require('../js/updateDriver.js');
var locateCtrl       = require('../js/locator.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//////////////////////////
// API to create driver //
//////////////////////////
router.post('/createDriver', function(req, res){
	console.log("\n Inside createDriver API \n");
	createDriverCtrl.createDriver(req, res);
});

////////////////////////////////////
// API to update status of driver //
////////////////////////////////////
router.put('/updateStatus/:driverId', function(req, res){
	console.log("\n Inside updateStatus API \n");
	updateDriverCtrl.updateStatus(req, res);
});


//////////////////////////////////
// API to update driver location //
//////////////////////////////////
router.put('/updateLocation/:driverId', function(req, res){
	console.log("\n Inside updateLocation API \n");
	updateDriverCtrl.updateLocation(req, res);
});


/////////////////////////////
// API to geoLocate driver //
/////////////////////////////
router.get('/locateDriver/:longitude-:latitude-:driverId', function(req, res){
	console.log("\n Inside locateDriver API \n");
	locateCtrl.locateDriver(req, res);
});

module.exports = router;
