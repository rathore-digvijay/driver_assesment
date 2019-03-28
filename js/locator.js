/*
* @Author: Dig-VJ Rathore
* @Date:   2019-03-28 00:20:01
* @Last Modified by:   digvijay
* @Last Modified time: 2019-03-28 15:47:03
*/

var async   = require('async');
var queries = require('../database/dbQueries.js');


var locator = {};

/**
 * This method get the details of the driver from database.
 * @method getDriverDetails
 * @author Digvijay Singh
 * @date   2019-03-28
 * @param  {Object}         params [object containing latitude, longitude and driverId]
 * @param  {Function}       cb     [callback as response]
 */
var getDriverDetails = function(params, cb){
	var query = {driverId: params.driverId};
	var projectionData = {_id: 0};
	queries.getDriver(query, projectionData, function(err, result){
		if(err || !result){
			// console.log("error");
			cb({success: false, info: "Driver with driverId doesn't Exist"});
		}else{
			// console.log("result");
			params.radius = result.radius;
			cb(null, params);
		}
	});
};


/**
 * This method get the drivers list within the maxdistance which we have taken from previous radius of the
 * driver which we have searched.
 * @method getDriversAroundPoint
 * @author Digvijay Singh
 * @date   2019-03-28
 * @param  {Object}              params [params object]
 * @param  {Function}            cb     [callback to nect function]
 */
var getDriversAroundPoint = function(params, cb){
	var query = {
					location: {
						$nearSphere: {
							$geometry : {
								type: "Point",
								coordinates: [JSON.parse(params.longitude), JSON.parse(params.latitude)]
							},
							$maxDistance : params.radius
						}
					}
				};
	// console.log("query --");
	queries.geoLocateDrivers(query, function(err, result){
		// console.log("err, result", err, result);
		if(!err){
			params.result = result;
			params.driverIds = [];
			for(var i = 0; i< result.length; i++){
				params.driverIds.push(result[i].driverId);
			}
			cb(null, params);
		}else{
			cb({success: false, info: "Error while locating driver"});
		}
	});
};

/**
 * This method check that the driver list that we have found from previous function contains 
 * the reuired driver whose driverId we have provided.
 * @method checkDriverInsidePOI
 * @author Digvijay Singh
 * @date   2019-03-28
 * @param  {Object}             params [params object]
 * @param  {Function}           cb     [callback as response]
 */
var checkDriverInsidePOI = function(params, cb){
	// console.log("params--", params);
	console.log(params.driverIds.includes(params.driverId));
	if(params.driverIds.includes(params.driverId)){
		cb(null, {success: true, result: "Driver is inside the region"});
	}else{
		cb({success: false, info: "Driver is not inside the region"});
	}
};


/**
 * This method locate the driver is inside the region or not by taking the longitude,
 * latitude of user and driverId of the driver.
 * @method locateDriver
 * @author Digvijay Singh
 * @date   2019-03-28
 * @param  {Object}     req [req object]
 * @param  {Callback}   res [JSON response]
 */
locator.locateDriver = function(req, res){
	console.log("inside locate driver function", req.params);
	async.waterfall([
		async.apply(getDriverDetails, req.params),
		getDriversAroundPoint,
		checkDriverInsidePOI
		], function(err, result){
			if(err){
				return res.json(err);
			}else{
				return res.json(result);
			}
		});

};

module.exports = locator;