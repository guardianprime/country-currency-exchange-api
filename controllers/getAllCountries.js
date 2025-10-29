import Country from "../model/countryModel.js";

const getAllCountries = async (req, res) => {
  try {
    const { region, currency, sort } = req.query;

    // Build filter object dynamically
    const where = {};
    if (region) where.region = region;
    if (currency) where.currencyCode = currency.toUpperCase();

    // Sorting logic
    let order = [];
    if (sort) {
      if (sort === "gdp_desc") order = [["estimatedGDP", "DESC"]];
      else if (sort === "gdp_asc") order = [["estimatedGDP", "ASC"]];
      else if (sort === "name_asc") order = [["name", "ASC"]];
      else if (sort === "name_desc") order = [["name", "DESC"]];
    }

    const countries = await Country.findAll({
      where,
      order,
    });

    res.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export default getAllCountries;
