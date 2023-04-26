# Relynk take home coding challenge

### Hi, my name is Oskar Pieniak! 👋 
This is the solution I am providing to the challenge.
The original [README](misc/README.md), with the instruction, can be found inside misc folder.

## Content

### Description
This project is a RESTful API that can efficiently process and store real estate sensor data from multiple rooms and query aggregated data over different time periods, measurement types, and resolutions. It provides two main endpoints - one to store the sensor data and another to query the stored data based on the provided parameters.

### Libraries
The solution focuses on the backend and is implemented in Node.js with Express.js framework. One reason for using Express.js is that it provides a robust framework for building RESTful APIs quickly and easily. Its simplicity and flexibility make it a popular choice for developers, allowing them to easily handle HTTP requests, routing, middleware, and error handling. 

The data is stored in a locally hosted MongoDB database using mongoose library for efficient querying and management.

To handle data coming in from different time zones, the API uses the moment library to convert incoming timestamps to UTC before storing them in the database.
### Testing
In order to test the API it was debugged and a number of queries were run using Postman software.

The API allows the user to query data based on start and end times, measurement type, room, and time resolution (raw, hourly, daily, weekly). Each parameter is optional to provide flexibility to the user. If the resolution is not set to "raw," the API calculates the average value of all the values that fall within a time bucket of the chosen resolution.

### Architecture
The current architecture of the project is based on the Express.js framework and follows a simple two-layered approach of handling HTTP requests and accessing the database using Mongoose. However, as the project grows and becomes more complex, it could benefit from a three-layered architecture.

The proposed architecture consists of:
- web layer responsible for handling HTTP requests and responses,
- service layer that encapsulates the business logic and performs data validation
- data access layer that interacts with the database. 

This approach provides several advantages, including improved scalability, maintainability, and testability.

### Further improvements

Trade-offs were made to keep the project scope manageable within the given time frame. Main focus was on the backend of the project so it could be further improved by adding a frontend - at least in a simple form of an html document that would allow to display received JSON files or post new sensor data with the use of a form. Additional features like user authentication and using HTTPS protocol for requests could be added to improve the security if more time was allocated. Furthermore, unit tests can be included in the development process of a software project to verify the functionality of individual units or components of the code.

## Prerequisities

Before running the application, make sure that you have the following software installed on your machine:

- **Node.js**
- **MongoDB**

## Installation

Install the dependencies using the following commands:
```
npm i express mongoose moment
npm i --save-dev nodemon
```

nodemon is installed as a development dependency as it is not required for production environment. 

Next step is to change the scripts property inside package.json in order to run server constantly allowing it to restart after each save of the server.js file:
```
"scripts": {
    "devStart": "nodemon server.js"
  },
```

In order to run the project use:
```
npm run devStart
```

## Usage
### Add new sensor data
To add new sensor data to the database, send a POST request to the '/data' endpoint with the following JSON payload:

```json
{
    "Value": 22.8,
    "Datetime": "2022-08-23T23:05:12.000Z",
    "Room": "Room A",
    "Measurement": "Temperature"
}
```
where:
- Value field is a number representing the sensor reading. 
- Datetime field is a string representing the date and time of the reading in ISO 8601 format. 
- Room and Measurement fields are strings representing the room name and the type of measurement, respectively.

The API will respond with a JSON object representing the data that was added to the database:

```json
{
    "value": 22.8,
    "datetime": "2022-08-23T23:05:12.000Z",
    "room": "Room A",
    "measurement": "Temperature",
    "_id": "64491b32414edd170f367f59",
    "__v": 0
}
```

### Query sensor data
To query sensor data from the database, send a GET request to the '/data' endpoint with the following query parameters:

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `start` | `string` | Represents the start date and time of the query in ISO 8601 format |
| `end` | `string` | Represents the end date and time of the query in ISO 8601 format |
| `measurement` | `string` | Represents the type of measurement to filter by |
| `room` | `string` | Represents representing the room name to filter by |
| `resolution` | `string` | Represents the desired resolution of the query. Default value is 'raw', other valid values are hourly, daily and weekly |

Example:
```http
GET /data?start=2022-08-01&end=2022-08-26&measurement=Temperature&room=Room B
```

You can also specify a resolution parameter to aggregate the data by hour or day. By default, the API returns the raw data.
Example:
```http
GET /data?start=2022-08-01&end=2022-08-26&measurement=Temperature&room=Room B&resolution=hourly
```

## Contact
Feel free to contact me via email: pieniakoskar44@gmail.com
