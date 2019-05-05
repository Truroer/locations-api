# locations-api

API for uploading a JSON files with locations and retrieving uploaded data

to run on yout localhost:3000:

clone the repo

`cd location-api`

`npm install`

go to mongodb.com and create your database:
-> Try free -> Build first Cluster -> choose Cloud provider & Region
after the sandbox is initiated go to Security -> MongoDB Users and add new user with username und password
go to Security -> IP Whitelist -> Add IP Address and add your IP address or press "Allow Access from Anywhere"
go to Overview and press "CONNECT" -> Connect Your Application and copy the connection string.

Add .env file in the main folder of the repository with following contens where username and password are from
the user you added at cloud.mongodb.com, clustername are the charachters from the connection
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
