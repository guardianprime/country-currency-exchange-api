import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Country = sequelize.define(
  "Country",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "is required" },
        notEmpty: { msg: "is required" },
      },
    },
    capital: { type: DataTypes.STRING },
    region: { type: DataTypes.STRING },
    population: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "is required" },
        isInt: { msg: "must be an integer" },
      },
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "is required" },
        notEmpty: { msg: "is required" },
      },
    },
    exchange_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: { msg: "is required" },
        isFloat: { msg: "must be a number" },
      },
    },
    estimated_gdp: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    flag_url: { type: DataTypes.STRING },
    last_refreshed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    updatedAt: "last_refreshed_at",
    createdAt: false,
  }
);

export default Country;
