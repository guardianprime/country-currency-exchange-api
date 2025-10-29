import axios from "axios";
import Country from "../model/countryModel.js";
import dotenv from "dotenv";
import { Op } from "sequelize";
dotenv.config();

const refreshData = async () => {
  const transaction = await sequelize.transaction();

  try {
    console.log("Refreshing country data...");
    let countryRes, rateRes;

    try {
      countryRes = await axios.get(process.env.COUNTRY_API_URL, {
        timeout: 10000,
      });
    } catch (err) {
      throw new Error("COUNTRY_API_FAILED");
    }

    try {
      rateRes = await axios.get(process.env.EXCHANGE_API_URL, {
        timeout: 10000,
      });
    } catch (err) {
      throw new Error("EXCHANGE_API_FAILED");
    }

    const countries = countryRes.data;
    const rates = rateRes.data.rates;

    for (const c of countries) {
      const code = c.currencies?.[0]?.code || null;

      let rate = null;
      let estimatedgdp = null;

      if (!code) {
        rate = null;
        estimatedgdp = 0;
      } else {
        rate = rates[code] || null;

        if (rate) {
          const random = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
          estimatedgdp = (c.population * random) / rate;
        } else {
          estimatedgdp = null;
        }
      }

      const existingCountry = await Country.findOne({
        where: {
          name: {
            [Op.like]: c.name,
          },
        },
      });

      if (existingCountry) {
        await existingCountry.update(
          {
            capital: c.capital,
            region: c.region,
            population: c.population,
            flag_url: c.flag,
            currency_code: code,
            exchange_rate: rate,
            estimated_gdp: estimatedgdp,
            last_refreshed_at: new Date(),
          },
          { transaction }
        );
      } else {
        await Country.create(
          {
            name: c.name,
            capital: c.capital,
            region: c.region,
            population: c.population,
            flag_url: c.flag,
            currency_code: code,
            exchange_rate: rate,
            estimated_gdp: estimatedgdp,
            last_refreshed_at: new Date(),
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    console.log("Country data updated");
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    console.error("Failed to refresh data:", err.message);

    if (err.message === "COUNTRY_API_FAILED") {
      return {
        success: false,
        error: "External data source unavailable",
        details: "Could not fetch data from Country API",
      };
    } else if (err.message === "EXCHANGE_API_FAILED") {
      return {
        success: false,
        error: "External data source unavailable",
        details: "Could not fetch data from Exchange Rate API",
      };
    }

    return {
      success: false,
      error: "External data source unavailable",
      details: err.message,
    };
  }
};

export default refreshData;
