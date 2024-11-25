const Charity = require("../models/charity");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../utils/database");
const Email = require("../services/emailService");

exports.register = async (req, res) => {
  const { name, email, location, category, password, mission, goals } = req.body;
  const t = await sequelize.transaction();
  try {
    const existingCharity = await Charity.findOne({ where: { email } });
    if (existingCharity) {
      return res
        .status(400)
        .json({ message: "Charity with this email already exists" });
    }

    // Hash password
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    await Charity.create({
      name,
      email,
      location,
      category,
      password: hashedPassword,
      mission,
      goals,
    }
    ,{ transaction: t });

   
    Email.sendEmail({ email: email, subject: "Charity Registration", textContent: "Charity registration is pending approval by the admin" });
    res
      .status(201)
      .json({
        message: "Charity registered successfully. Pending admin approval.",
      });

    await t.commit();
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // check user exists or not
        const user = await Charity.findOne({ where: { email } });
        if (!user) {
          return res.status(404).json({ error: "Charity not found" });
      }
      // check user is approved or not
      if (!user.isApproved) {
        return res.status(401).json({ error: "Charity is not approved" });
      }
        // compare password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        // generate JWT token
        const token = jwt.sign({ charityId: user.id , charityName: user.name}, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        // return token
        return res.status(200).json({ message: "Login successful", token });
      } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.approveCharity = async (req, res) => {
  const charityId = req.params.id;
  try {
    const charity = await Charity.findByPk(charityId);
    if (!charity) return res.status(404).json({ message: "Charity not found" });

    charity.isApproved = true;
    await charity.save();
    Email.sendEmail({ email: charity.email, subject: "Charity Approval", textContent: "Charity has been approved by the admin. Now You can start your Project Campaign!" });
    res.status(200).json({ message: "Charity approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.rejectCharity = async (req, res) => {
    const charityId = req.params.id;
    try {
      const charity = await Charity.findByPk(charityId);
      if (!charity) return res.status(404).json({ message: "Charity not found" });
  
      charity.isApproved = false;
      await charity.save();
      Email.sendEmail({ email: charity.email, subject: "Charity Rejection", textContent: "Charity has been rejected by the admin, Pease contact the administrator" });
      res.status(200).json({ message: "Charity rejected successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

exports.getCharity = async (req, res) => {
  try {
    const { category, location, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (category) where.category = category;
    if (location) where.location = location;
    if (search) where.name = { [Op.like]: `%${search}%` };

    const charities = await Charity.findAndCountAll({
      where,
      attributes: ["id", "name", "email", "mission", "goals", "location", "category", "isApproved", "createdAt"],
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      charities: charities.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(charities.count / limit),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching charities", error: error.message });
  }
};

// get charity details with id
exports.getCharityById = async (req, res) => {
    try {
      const charity = await Charity.findByPk(req.params.id
          ,{attributes: ["id", "name", "email", "mission", "goals", "location", "category", "isApproved", "createdAt"]},
        );
        if (!charity) {
            return res.status(404).json({ error: "Charity not found" });
        }
        res.status(200).json({ charity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update charity details
exports.updateCharity = async (req, res) => {
    const { name, email, mission, goals } = req.body;
    // get charity id from token
    const charityId = req.charity.id;
    try {
        const charity = await Charity.findByPk(charityId);
        if (!charity) {
            return res.status(404).json({ error: "Charity not found" });
        }
        // Update charity details
        charity.name = name || charity.name;
        charity.email = email || charity.email;
        charity.mission = mission || charity.mission;
        charity.goals = goals || charity.goals;
        await charity.save();
        res.status(200).json({ message: "Charity updated successfully", charity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}