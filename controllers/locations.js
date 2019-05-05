const helperFunctions = require("../helper-functions");
const mongoose = require("mongoose");
const fs = require("fs");
const Location = require("../models/location");
require("dotenv").config();

exports.get_all = (req, res, next) => {
  // Retrieve all locations from DB
  Location.find()
    .select("locationName")
    .exec()
    .then(locations => {
      const result = {
        count: locations.length,
        request: {
          description: "Post new location. No login required.",
          type: "GET",
          url: `${process.env.URL}/locations`
        },
        locations: locations.map(location => {
          return {
            locationName: location.locationName,
            _id: location._id,
            //Provide info on url to get individual locations
            request: {
              description: "Get location details. Login required.",
              type: "GET",
              url: `${process.env.URL}/locations/${location._id}`
            }
          };
        })
      };
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({ err: err });
    });
};
//Retrieve details of individual location by id
exports.find_location = (req, res, next) => {
  Location.findById(req.params.locationID)
    .exec()
    .then(location => {
      const result = {
        message: "Location details:",
        _id: location._id,
        locationName: location.locationName,
        longitude: location.longitude,
        latitude: location.latitude,
        distanceToOffice: location.distanceToOffice,
        additionalData: location.additionalData,
        request: {
          description: "Get all locations. Login required",
          type: "GET",
          url: `${process.env.URL}/locations`
        }
      };
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({ err: err });
    });
};

exports.create_new_location = (req, res, next) => {
  let uploadedFile;

  // check if upload was successfull
  if (req.file) {
    uploadedFile = fs.readFileSync("/" + req.file.path, "utf8", err => {
      if (err) {
        console.log(err);
      }
    });

    let uploadedFileParsed = JSON.parse(uploadedFile);

    //check the file for consistency and having latitude and longitude properties
    if (helperFunctions.checkJSONFileConsistency(uploadedFileParsed)) {
      //if file consistent and has latitude and longitude properties save the file content to DB

      //   console.log(uploadedFileParsed);

      let additionalData = {};

      for (const prop in uploadedFileParsed) {
        if (prop !== "longitude" && prop !== "latitude") {
          additionalData[prop] = uploadedFileParsed[prop];
        }
      }

      const location = new Location({
        _id: new mongoose.Types.ObjectId(),
        _filePath: req.file.path,
        locationName: req.file.originalname.split(".json")[0],
        longitude: uploadedFileParsed.longitude,
        latitude: uploadedFileParsed.latitude,
        distanceToOffice: helperFunctions.getDistanceToOffice(
          uploadedFileParsed
        ),
        additionalData: additionalData
      });
      location
        .save()
        .then(doc => {
          console.log(doc);
          const result = {
            message: `Uploaded file: ${req.file.originalname}. Check: ok`,
            location: {
              locationName: doc.locationName
            },
            request: {
              description: "Get location details. Login required",
              type: "GET",
              ulr: `${process.env.URL}/${doc._id}`
            }
          };
          return res.status(201).json(result);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ err: err });
        });

      // Send ok response
    } else {
      //if no latitude and longitude properties or inconsistent,
      //delete the uploaded file and send unprocessable entity response
      fs.unlink(req.file.path, err => {
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
    //If no file provided or sent not over multipart/form-data
  } else {
    res.status(500).json({
      message:
        "No file privided. Please provide a JSON formatted file with filename indicating location name. The file should be sent via multipart/form-data in the field 'locationname'"
    });
  }
};

exports.delete_location = (req, res, next) => {
  let _filePath;
  const _id = req.params.locationID;
  //Extract the filepath on server stored in DB
  Location.findById(_id)
    .exec()
    .then(location => {
      _filePath = location._filePath;
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({ err: err });
    });
  //Remove location from DB
  Location.remove({ _id: _id })
    .exec()
    .then(result => {
      //Remove location file form server
      fs.unlink(_filePath, err => {
        if (err) {
          console.log(err);
        }
      });
      res.status(200).json({
        message: `Location removed`,
        request: {
          description: "Get all locations. Login required",
          type: "GET",
          url: `${process.env.URL}/locations`
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(404).json({ err: err });
    });
};
