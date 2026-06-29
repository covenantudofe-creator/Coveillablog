const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const Newsletter = sequelize.define("Newsletter", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

module.exports = Newsletter;