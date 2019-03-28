/*
* @Author: Dig-VJ Rathore
* @Date:   2019-03-28 00:36:25
* @Last Modified by:   digvijay
* @Last Modified time: 2019-03-28 15:43:28
*/

var async = require('async');
var queries = require('../database/dbQueries.js');

var updateDriverCtrl = {};

/**
 * The method gets the status of the driver on basis of driverId in query.
 * @method getDriverStatus
 * @author Digvijay Singh
 * @date   2019-03-28
 * @param  {Object}        params [object containing driverId]
 * @param  {Function}      cb     [callback as response]
 */
var getDriverStatus = function(params, cb){
	var query = params;
	var projectionData = {status: 1};
	queries.getDriver(query, projectionData, function(err, result){
		if(!err){
			if(!!result){
				params.status = result.status;
				cb(null, params);
			}else{
				cb({success: false, info: "No Driver with this driverId exists."});
			}
		}else{
			cb({success: false, info: "Error while getting driver status details."});
		}
	});
};

/**
 * This method check the status and change it accordingly with the query.
 * @method changeStatus
 * @author Digvijay Singh
 * @date   2019-03-28
 * @param  {Object}     params [params object from above function]
 * @param  {Function}   cb     [callback as response]
 */
var changeStatus = function(params, cb){
	var data = {};
	if(params.status === "ONLINE"){
		data.status = "OFFLINE";
	}else{
		data.status = "ONLINE";
	}
	queries.updateDriver(params.driverId, data, function(err, result){
		if(err){
			cb({success: false, info: "Error while updating status"});
		}else{
			cb(null, params);
		}
	});
};

/**
 * This method change the driver status.
 * @method updateStatus
 * @author Digvijay Singh
 * @date   2019-03-28
 * @param  {Object}     req [req object]
 * @param  {Callback}   res [response object]
 */
updateDriverCtrl.updateStatus = function(req, res){
	console.log("inside updateStatus method the data in params is--"+ req.params);
	async.waterfall([
		async.apply(getDriverStatus, req.params),
		changeStatus
		], function(err, result){
			if(err){
				return res.json({success: false, info : err.info});
			}else{
				return res.json({success: true, result: "Driver's status updated."});
			}
		});
};


/**
 * This method validate the driver that it exist or not when searched with driverId.
 * @method validateDriver
 * @author Digvijay Singh
 * @date   2019-03-28
 * @param  {Object}       params [object containing request data and params]
 * @param  {Function}     cb     [callback as response]
 */
var validateDriver = function(params, cb){
	var query = {driverId: params.driverId};
	var projectionData = {_id: 0};
	queries.getDriver(query, projectionData, function(err, result){
		if(err){
			cb({success: false, info: "Error occurred while validating driver."});
		}else if(!!result){
			cb(null, params);
		}else{
			cb({success: false, info: "No Driver with this driverId exists."});
		}
	});
};

/**
 * This method update the driver location with query.
 * @method updateDriverLocation
 * @author Digvijay Singh
 * @date   2019-03-28
 * @param  {Object}             params [params object]
 * @param  {Function}           cb     [callback as response]
 */
var updateDriverLocation = function(params, cb){
	console.log("in updateLocation-");
	var data = {
		location: {
			type: "Point",
			coordinates: [params.longitude, params.latitude]
		}
	};
	queries.updateDriver(params.driverId, data, function(err, result){
		if(err){
			cb({success: false, info: "Error while updating status"});
		}else{
			cb(null, params);
		}
	});
};

/**
 * This method is used to update the location of driver. First it validate driver then update location.
 * @method updateLocation
 * @author Digvijay Singh
 * @date   2019-03-28
 * @param  {Object}       req [request object containing data and params]
 * @param  {Callback}     res [a JSON response]
 */
updateDriverCtrl.updateLocation = function(req, res){
	console.log("inside update location of driver the driverId is--", req.params);
	console.log("the data of location is--"+ req.body);
	var data = {
		driverId : req.params.driverId,
		longitude: req.body.longitude,
		latitude: req.body.latitude
	};
	async.waterfall([
		async.apply(validateDriver, data),
		updateDriverLocation
		], function(err, result){
			if(err){
				return res.json({success: false, info: err.info});
			}else{
				return res.json({success: true, result: "Driver's location updated"});
			}
		});
};

module.exports = updateDriverCtrl;

