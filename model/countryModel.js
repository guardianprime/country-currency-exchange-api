import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const Country = sequelize.define(
  "Country",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    capital: { type: DataTypes.STRING },
    region: { type: DataTypes.STRING },
    population: { type: DataTypes.INTEGER },
    flag: { type: DataTypes.STRING },
    currencyCode: { type: DataTypes.STRING },
    exchangeRate: { type: DataTypes.FLOAT },
    estimatedGDP: { type: DataTypes.FLOAT },
  },
  {
    timestamps: true,
  }
);

export default Country;
