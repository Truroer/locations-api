const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;

    //Checking if the user is beeing removed by himself
    if (
      req.userData.userId !== req.params.userId &&
      (req.baseUrl === "/user" && req.method === "DELETE")
    ) {
      return res.status(401).json({ message: "Auth failed" });
    }

    //Checking if the user is still in the DB
    User.findById({ _id: req.userData.userId })
      .exec()
      .then(user => {
        if (!user) {
          res.status(401).json({ message: "Auth failed" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(401).json({ message: "Auth failed" });
      });
    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" });
  }
};
