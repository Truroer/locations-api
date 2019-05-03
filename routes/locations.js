const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const helperFunctions = require("../helper-functions");

//Storing uploaded files
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    //Location names will be lower cased
    cb(null, new Date().getTime() + "__" + file.originalname.toLowerCase());
  }
});

const fileFilter = (req, file, cb) => {
  //reject non-json formatted files
  if (file.mimetype === "application/json") {
    cb(null, true);
  } else {
    cb(
      new Error("Wrong file type : please provide a JSON formatted file"),
      false
    );
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Endpoints

// Uploading per POST request
router.post("/", upload.single("locationname"), (req, res, next) => {
  let uploadedFile;
  let generalLocationData;
  console.log("dsfsdf", req.file);

  // check if upload was successfull
  if (req.file) {
    uploadedFile = fs.readFileSync(
      req.file.destination + req.file.filename,
      "utf8",
      err => {
        if (err) {
          console.log(err);
        }
      }
    );

    let uploadedFileParsed = JSON.parse(uploadedFile);

    //check the file for consistency and having latitude and longitude properties
    if (
      helperFunctions.checkJSONFileConsistency(
        uploadedFileParsed,
        req.file.originalname
      )
    ) {
      //if file consistent and has latitude and longitude properties insert
      //the location name and location ID into locationsList file storing
      //names and IDs for all locations
      generalLocationData = {
        locationName: req.file.originalname.split(".json")[0],
        locationID: req.file.filename.split(".json")[0]
      };

      fs.appendFile(
        "./results/locationsList",
        "," + JSON.stringify(generalLocationData),
        err => {
          if (err) {
            console.log(err);
          }
        }
      );
      // Send ok response
      return res.status(201).json({
        message: `Uploaded file: ${req.file.originalname}. Check: ok`
      });
    } else {
      //if no latitude and longitude properties or inconsistent,
      //delete the ukploaded file and send unprocessable entity response
      fs.unlink(req.file.destination + req.file.filename, err => {
        if (err) {
          console.log(err);
        }
      });
      return res.status(422).json({
        message: `Please check file consistency of ${
          req.file.originalname
        }. Make sure the file is properly structured and has "longitude" and "latitude" properties.`
      });
    }
  }
});

//List all locations by GET request
router.get("/", (req, res, next) => {
  let locationsList =
    "[" +
    fs.readFileSync("./results/locationsList", "utf8", err => {
      if (err) {
        console.log(err);
      } else {
      }
    }) +
    "]";

  locationsList = JSON.parse(locationsList);
  locationsList.splice(0, 1);
  locationsList = locationsList.map(genData => {
    return {
      locationName: genData.locationName,
      locationID: genData.locationID
    };
  });

  console.log(locationsList);

  res.status(200).json({
    locationsList: locationsList
  });
});

//Details for particular location
router.get("/:locationID", (req, res, next) => {
  const id = req.params.locationID;

  let fullLocationData = fs.readFileSync(
    "./uploads/" + id + ".json",
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );

  fullLocationData = JSON.parse(fullLocationData);
  fullLocationData.location = id;
  fullLocationData.distanceToOffice = helperFunctions.getDistanceToOffice(
    fullLocationData
  );

  res.status(200).json({
    message: "You passed an ID of " + id,
    fullLocationData: fullLocationData
  });
});

module.exports = router;
