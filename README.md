## London Underground
An API for a London underground app. This is a continuation of a group project which can be found at https://github.com/iO-Academy/2022-mar-london-underground-be. Compared to the original, the backend now has support for journeys requiring a line change between start and end stations.

## Description
London-Underground API is built using Node.JS, Express and Mongodb.

## Getting Started
1. Clone this repo:
```
git clone git@github.com:AndrewScott85/london-underground-be-continuation.git
```
### Create the Database
2. Open the Mongodb app.
3. Create a database in mongodb called tubulardb and a collection called lines.
4. Use the tubular.json file to populate the database.

### Set Up the Backend
5. Open a terminal emulator (such as Terminal) and navigate to the directory, e.g.:
```bash
cd 2022-mar-london-underground-be
npm install
```

## Run the API
1. In the terminal emulator, navigate into the backend directory.
```bash
node app.js
```
2. The London-Underground API will be available at http://localhost:3001

## Terminating the Application
## Terminate the Backend and Frontend
Both apps can be stopped from the terminal emulator by pressing Control-C in their tabs.

# API Documentation
This API supports GET and POST

## Get All Stations

* **URL**

  `/stations`

* **Method**

  `GET`

* **Response**
  * **Code:** 200
  * **Content:**
  ```json
    [
      "Baker Street (BST)",
      "Charing Cross (CHX)"
    ]
  ```
    
 ## Get Journey

* **URL**

  `/journeys`

* **Method**

  `POST`
 
* **Data Params**

  * **Body:** `{"selectedStartStation":"string","selectedEndStation":"string"}`

* **Response**

  * **Code:** 200 <br />
  * **Content:** <br />
  ```json
  [
    {
      "line": "District",
      "stops": 35,
      "time": 6408,
      "price": 399,
      "stations": [
        {
          "stop": "Embankment",
          "timeToNext": 274
        },
        {
          "stop": "Fulham Broadway",
          "timeToNext": 42
        },
      ]
    }
  ]
  ```
  
## Any Other URL

* **Response**

  * **Code:** 500
  * **Content:**
  ```json
  {
      "code": 500,
      "message": "Unknown route"
  }
  ```

