# DMV-Blockchain

This program demostrates an application of blockchain technology specifically in the Department of Motor Vehicles (DMV). The usage of this technology maintains the integrity of past records. A record in this context is the information pertaining a driver including vehicles owned.

## Implementation
The program back-end features blockchain implementation that can be interacted with using APIs and a front-end that provides an intuitive UI that allows for updates to the blockchain.

### Blockchain API Server
The blockchain data structure is implemented in [Python](https://www.python.org/) and utilizes RSA encryption and SHA-256 hashing schemes from [PyCryptodome](https://github.com/Legrandin/pycryptodome/). Each block in the chain is made up of an `entry` object which consists `driver` objects. This is to allow recording simultaneous updates to multiple `driver` objects such as transferring `vehicle` ownership. The blockchain is initialized with randomly generated drivers and can be accessed and/or updated via the API endpoints implemented using [Flask](https://palletsprojects.com/p/flask/). The following API endpoints are provided:

* `/checkChainValidity`: `GET` method that returns the validity status of the blockchain.
* `/drivers`: `GET` method that returns driver information in the blockchain
* `/renewDL`: `POST` method that updates the driver's license expiry date. Requires `driverAddress` parameter and expects `months` in the data body.
* `/updateAddress`: `POST` method that updates the driver's address. Requires `driverAddress` parameter and expects `address` in the data body.
* `/realID`: `GET` method that updates the driver's license to a Real ID. Requires `driverAddress` parameter.
* `/updatePracticeExamScore`: `POST` method that updates the driver's practice test score. Requires `driverAddress` parameter.
* `/vehicles`: `GET` method that returns vehicles owned by the driver. Requires `driverAddress` parameter.
* `/updateVehicleOwner`: `POST` method that transfers vehicle ownership from one driver to another. Requires `driverAddress` and `newOwner` parameters and expects vehicle `vin` in the data body.
* `/vaTitle`: `GET` method that updates vehicle's registration state to VA. Requires `driverAddress` and `vin` parameters.
* `/vehicleSoldOrTraded`: `POST` method that removes vehicle ownership from driver. Requires `driverAddress` parameter and expects vehicle's `vin` in data body.
* `/renewReg`: `POST` method that updates vehicle's registration expiry date. Requires `driverAddress` parameter and expects `months` in data body.

### Front-End UI
The program has a front-end implemented in [ReactJS](https://reactjs.org/) that uses the above API endpoints. This interface provides the following functionality:

* Online Services
    * Vehicle Registration Renewal
    * Address Change
    * Driver License Renewal
    * Report a Vehicle Sold/Traded
* Driver/ID
    * Practice Exams
    * Real ID
    * Obtain Vital Record
* Vehicles
    * Selling/donating a vehicle
    * Titling a vehicle in Virginia

The features above require a selected driver which by default is the first driver in the dropdown. Additionally, an option to check the chain's validity from any page is also provided.

## Running the program

This documentation assumes that [Python 3](https://www.python.org/downloads/) and [Node.js](https://nodejs.org/en/) along with a package manager have been installed. This program can be executed using [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) which are both package managers for the JavaScript programming language. The front-end is accessible through [localhost:3000](http://localhost:3000) and it interacts with the API server running on [localhost:5000](http://localhost:5000).

### Execution using npm
```shell
$ npm run start-api
$ npm start
```

### Execution using Yarn
```
$ yarn start-api
$ yarn start
```