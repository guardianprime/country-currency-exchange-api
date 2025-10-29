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
      allowNull: true,
      defaultValue: 0,
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    exchange_rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
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
