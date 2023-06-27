const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  avatar: { type: DataTypes.STRING, defaultValue: "/1.png" },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: "USER" },
});

module.exports = User;


