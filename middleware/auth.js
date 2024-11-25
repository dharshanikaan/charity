require('dotenv').config({ path: '../expenseapppassword/.env' });
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Charity = require("../models/charity");




exports.authMiddleware = async (req, res, next) => { 
      try {
        const token = req.header("Authorization");

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const userExits = await User.findByPk(payload.userId);

        if (!userExits) {
          return res.status(401).json({ error: "User not found" });
        }
          req.user = {
            id: userExits.id,
            name: userExits.name
        }
        next();
      } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Unauthorized" });
      }
}

exports.charityAuthMiddleware = async (req, res, next) => { 
  try {
    const token = req.header("Authorization");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const charity = await Charity.findByPk(payload.charityId);
    if (!charity) {
      return res.status(401).json({ error: "Charity not found" });
    }
    req.charity = {
      id: charity.id,
      name: charity.name
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

exports.adminMiddleware = async (req, res, next) => { 
  try {
    const token = req.header("Authorization");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userExits = await User.findByPk(payload.userId);
    if (!userExits) {
      return res.status(401).json({ error: "User not found" });
    }
    if (!userExits.isAdmin) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}