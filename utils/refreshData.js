import axios from "axios";
import Country from "../model/countryModel.js";
import dotenv from "dotenv";
import generateSummaryImage from "../services/imageService.js";
import { Op } from "sequelize";
import { sequelize } from "../db.js";
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

    // DEBUG: Log the first country to see the structure
    console.log(
      "First country structure:",
      JSON.stringify(countries[0], null, 2)
    );

    for (const c of countries) {
      // FIX: Handle different API response structures
      // For REST Countries API v3.1
      const name = c.name?.common || c.name?.official || c.name;
      const capital = Array.isArray(c.capital) ? c.capital[0] : c.capital;
      const region = c.region;
      const population = c.population;
      const flag = c.flags?.png || c.flags?.svg || c.flag;

      // Handle currencies object (REST Countries returns an object, not array)
      let code = null;
      if (c.currencies) {
        // REST Countries v3.1 format: { USD: { name: "United States dollar", symbol: "$" } }
        code = Object.keys(c.currencies)[0];
      } else if (Array.isArray(c.currencies) && c.currencies.length > 0) {
        // Alternative format: [{ code: "USD", name: "...", symbol: "..." }]
        code = c.currencies[0].code;
      }

      // Skip if essential data is missing
      if (!name) {
        console.warn("Skipping country with no name:", c);
        continue;
      }

      let rate = null;
      let estimatedgdp = null;

      if (!code) {
        rate = null;
        estimatedgdp = 0;
      } else {
        rate = rates[code] || null;

        if (rate && population) {
          const random = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
          estimatedgdp = (population * random) / rate;
        } else {
          estimatedgdp = null;
        }
      }

      const existingCountry = await Country.findOne({
        where: {
          name: {
            [Op.like]: name,
          },
        },
      });

      const countryData = {
        name: name,
        capital: capital || null,
        region: region || null,
        population: population || 0,
        flag_url: flag || null,
        currency_code: code,
        exchange_rate: rate,
        estimated_gdp: estimatedgdp,
        last_refreshed_at: new Date(),
      };

      if (existingCountry) {
        await existingCountry.update(countryData, { transaction });
      } else {
        await Country.create(countryData, { transaction });
      }
    }

    await transaction.commit();
    console.log("Country data updated");

    const totalCountries = await Country.count();
    const topCountries = await Country.findAll({
      order: [["estimated_gdp", "DESC"]],
      limit: 5,
      attributes: ["name", "estimated_gdp"],
    });
    const timestamp = new Date();

    await generateSummaryImage(totalCountries, topCountries, timestamp);

    return { success: true };
  } catch (err) {
    await transaction.rollback();
    console.error("Failed to refresh data:", err.message);
    console.error("Full error:", err);

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
