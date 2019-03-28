/*
* @Author: Dig-VJ Rathore
* @Date:   2019-03-27 22:56:33
* @Last Modified by:   digvijay
* @Last Modified time: 2019-03-28 13:32:10
*/


const connection = require('./dbConnection.js');
var config = require('../config/dbConfig.js');
const db = connection.getDb;

var queries = module.exports;

queries.createDriver = function(data, cb){
	console.log("here data--", data);
	db().db(config.db_name).collection('drivers').insertOne(data, function(err, result){
		cb(err, result);
	});
};

queries.getDriver = function(query, projectionData, cb){
	db().db(config.db_name).collection('drivers').findOne(query, {projection: projectionData}, function(err, result){
		cb(err, result);
	});
};

queries.updateDriver = function(driverId, data, cb){
	db().db(config.db_name).collection('drivers').updateOne({driverId: driverId}, {$set: data}, function(err, result){
		cb(err, result);
	});
};

queries.geoLocateDrivers = function(query, cb){
	db().db(config.db_name).collection('drivers').createIndex( { location : "2dsphere" } );
	db().db(config.db_name).collection('drivers').find(query).toArray(function (err, result) {
		cb(err, result);
	});
};



