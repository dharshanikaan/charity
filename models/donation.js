const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const user = require("./user");
const project = require("./project");



const Donation = sequelize.define(
  "donation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
    status: {
      type: DataTypes.STRING,
    },
    payment_id: {
      type: DataTypes.STRING,
    },
    projectId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: "CASCADE",
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

user.hasMany(Donation, { foreignKey: "userId", onDelete: "CASCADE" });
Donation.belongsTo(user, { foreignKey: "userId", onDelete: "CASCADE" });

project.hasMany(Donation, { foreignKey: "projectId", onDelete: "CASCADE" });
Donation.belongsTo(project, { foreignKey: "projectId", onDelete: "CASCADE" });

module.exports = Donation;