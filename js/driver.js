/*
* @Author: Dig-VJ Rathore
* @Date:   2019-03-27 22:34:31
* @Last Modified by:   digvijay
* @Last Modified time: 2019-03-28 15:37:26
*/

var async = require('async');
var shortid = require('shortid');
var queries = require('../database/dbQueries.js');

var createDriverCtrl = {};

/*
 * This method initialize the data and create a random driverId for every driver.
 */
var initializeData = function(params, cb){
	var data = {
		driverId: shortid.generate(),
		driverName : params.driverName,
		location: {
			type: "Point",
			coordinates : [params.longitude, params.latitude]
		},
		radius: params.radius,
		status: (!!params.status && params.status.toUpperCase == "ONLINE") ? "ONLINE" : "OFFLINE", 
		password: params.password
	};
	cb(null, data);
};

/*
 * This method call the insert query to insert data in database. 
 */
var insertDriverData = function(params, cb){
	console.log("inside insert driver data--", params);
	queries.createDriver(params, function(err, result){
		console.log("query result", err, result);
		if(err){
			cb({success: false, info: "Error while creating driver !!"});
		}else{
			cb(null, params);
		}
	});
};

/*
 * This method is used to create driver with the data provided in the API body.
 */
createDriverCtrl.createDriver = function(req, res){
	console.log("inside createDriver method the data is- "+ JSON.stringify(req.body));
	async.waterfall([
		async.apply(initializeData, req.body),
		insertDriverData
		], function(err, result){
			if(err){
				return res.json({success: false, info: err.info});
			}else{
				return res.json({success: true, result: "Driver Created Successfully", driverId: result.driverId});
			}
		});
};


module.exports = createDriverCtrl;