const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  _filePath: String,
  locationName: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  distanceToOffice: String,
  additionalData: Object
});

module.exports = mongoose.model("Location", locationSchema);
