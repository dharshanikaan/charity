const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const Project = require("./project");

const ImpactReport = sequelize.define(
  "impactReport",
  {
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
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

ImpactReport.belongsTo(Project, {
  foreignKey: "projectId",
  onDelete: "CASCADE",
});
Project.hasMany(ImpactReport, { foreignKey: "projectId", onDelete: "CASCADE" });

module.exports = ImpactReport;