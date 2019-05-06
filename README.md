## Getting started

##### API for uploading a JSON files with locations and retrieving uploaded data

To run on your localhost:3000:

To get Node go to nodejs.org

Clone this repo:

`git clone https://github.com/Truroer/locations-api`

`cd location-api`

Install the node modules

`npm install`

Go to mongodb.com and create your database:

-> Try free
-> Build first Cluster
-> choose Cloud provider & Region
after the sandbox is initiated go to Security -> MongoDB Users and add new user with username und password
go to Security -> IP Whitelist -> Add IP Address and add your IP address or press "Allow Access from Anywhere"
go to Overview and press "CONNECT" -> Connect Your Application and copy the connection string.

Add .env file in the main folder of the repository with following contens where username and password are from
the user you added at cloud.mongodb.com, clustername ist the charachters from the connection
string between '....<password>@' and '.mongodb.net...' :

---

    URL= http://localhost:3000
    PORT= 3000
    MONGO_ATLAS_USER= username
    MONGO_ATLAS_PASSWORD = password
    MONGO_ATLAS_CLUSTER = clustername
    JWT_KEY = secretkey

---

save the .env file and run `node server`

To deploy this app on a server please follow the above mentioned steps for db initiation and provide the environment variables mentioned earlier.

## Endpoint Documentation

##### `POST: /user/signup`

Creates a new user. Please provide email and password for the user in the body of the request:
`{"email": <userEmail>, "password": <userPassword>}`. Please specify `Content-Type: application/json` in HEADERS.

##### `POST: /user/login`

Logs in an existing user and generates the `token`. Please provide email and password for the user in the body of the request:
`{"email": <userEmail>, "password": <userPassword>}`. Please specify `Content-Type: application/json` in HEADERS.

##### `DELETE: /user/:userId`

Deletes an existing user and cancels any active tokens issued for his logins.
Autorization required: please provide HEADERS with autorization field:
`'Autorization': 'Bearer <token>'`. A user can only be deleted by himself, e.i. the `token` provided for this request should be generated when this user signed in.

##### `POST: /locations`

Uploads the location file to server and lets insert the data to the database.
No autorization required.
Please provide `.json` file over `multipart/form-data` in the field `locationname`. The filename should indicate location name. The file should be JSON formated and consistent, it should have 'latitude' and 'longitude' fields with specifying the longitude and latitude for the given location in decimal degrees like `{ "latitude": 51.46871667, "longitude": 6.97805556 }`, NOT in minutes and seconds like 51°68'56".

##### `GET: /locations`

Gets list of all uploaded locations.
Autorization required: please provide HEADERS with autorization field:
`'Autorization': 'Bearer <token>'`

##### `GET: /locations/:locationId`

Gets detailes of the location with the id provided in params.
Autorization required: please provide HEADERS with autorization field:
`'Autorization': 'Bearer <token>'`

##### `DELETE: /locations/:locationId`

Deletes a location with the provided id from the database and original file from the server.
Autorization required: please provide HEADERS with autorization field:
`'Autorization': 'Bearer <token>'`
