const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "../uploads/");
  },
  filename: function(req, file, cb) {
    //Location names will be lower cased and saved as TimeStamp__locationName to prevent same filenames if
    //same locations are uploaded multiple times
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

module.exports = upload.single("locationname");
