const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const user = require("./user");

const Download = sequelize.define(
  "downloads",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },  
  },
  {
    timestamps: true,
  }
);

user.hasMany(Download, { foreignKey: "userId", onDelete: "CASCADE" });
Download.belongsTo(user, { foreignKey: "userId", onDelete: "CASCADE" });


module.exports = Download;