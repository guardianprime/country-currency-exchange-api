import axios from "axios";
import Country from "../model/countryModel.js";
import dotenv from "dotenv";
dotenv.config();

const refreshData = async () => {
  try {
    console.log("Refreshing country data...");

    // Fetch countries
    const countryRes = await axios.get(process.env.COUNTRY_API_URL);
    const countries = countryRes.data;

    // Fetch exchange rates
    const rateRes = await axios.get(process.env.EXCHANGE_API_URL);
    const rates = rateRes.data.rates;

    // Loop through countries and process
    for (const c of countries) {
      const code = c.currencies?.[0]?.code;
      const rate = rates[code] || null;
      const random = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
      const estimated_gdp = rate ? (c.population * random) / rate : null;

      await Country.upsert({
        name: c.name,
        capital: c.capital,
        region: c.region,
        population: c.population,
        flag: c.flag,
        currencyCode: code,
        exchangeRate: rate,
        estimatedGDP: estimated_gdp,
      });
    }

    console.log("Country data updated");
  } catch (err) {
    console.error("Failed to refresh data:", err.message);
  }
};

export default refreshData;
