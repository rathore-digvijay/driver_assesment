# driver_assesment

Dillinger is a cloud-enabled, mobile-ready, offline-storage, AngularJS powered HTML5 Markdown editor.

  - Type some Markdown on the left
  - See HTML in the right
  - Magic


### Tech

The work done to create API is done in:

* [node.js](https://nodejs.org/) - evented I/O for the backend
* [Express](https://expressjs.com/) - fast node.js network app framework
* [MongoDb](https://www.mongodb.com/) - NoSQL Document database with scalability and flexibility.



### Installation

Dillinger requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd assesment
$ npm install
$ npm start
```
Server will start on localhost:3000


### API

* To create Driver - /createDriver  (type - POST)
	
	Description - This API create the driver with the data provided and generate a random driverId.

	Payload - 
	{
		"driverName" : "Driver_name",
		"longitude" : Longitude coordinate,
		"latitude": Latitude Coordinate,
		"radius": Radius in meter,
		"status":  "status either OFFLINE/ONLINE" , 
		"password": "password"
	}

	Response - 
		Successfull   - {success: true, result: "Driver Created Successfully", driverId: "Driver ID"}
		Unsuccessfull - {success: false, info: "error info"}


* To update status of driver - /updateStatus/:driverId  (type - PUT)

	Description - This API update the status of the driver.
	
	Response - 
		Successfull   - {success: true, result: "Driver's status updated."}
		UnsuccessFull - {success: false, info: "error info"}

* To update driver location - /updateLocation/:driverId   (type - PUT)

	Description - This API update the driver location.

	Response - 
		Successfull  - {success: true, result: "Driver's location updated"}
		Unsuccessful - {success: false, info: "error info"}


* To geoLocate driver  - /locateDriver/:longitude-:latitude-:driverId   (type - GET)

	Description - This method take a coordinate point of user and driverId and return the the driver 		is nearby to the user in reference of driver radius .

	Response - 
		Successfull  - {success: true, result: "Driver is inside the region"}
		Unsuccessful - {success: false, info: "Driver is not inside the region"}

