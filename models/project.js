const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const Charity = require("./charity");

const Project = sequelize.define("project", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  donationGoal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currentDonations: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
});

Charity.hasMany(Project, { foreignKey: "charityId", onDelete: "CASCADE" });
Project.belongsTo(Charity, { foreignKey: "charityId", onDelete: "CASCADE" });

module.exports = Project;