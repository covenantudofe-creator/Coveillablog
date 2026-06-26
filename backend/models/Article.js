const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const Article = sequelize.define("Article", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  subtitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Article;