const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");

const User = sequelize.define(
  "User",
  {
    googleSub: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
      field: "google_sub",
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("email", value.trim().toLowerCase());
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    picture: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "password_hash",
    },
    resetPasswordTokenHash: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
      field: "reset_password_token_hash",
    },
    resetPasswordExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "reset_password_expires_at",
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
