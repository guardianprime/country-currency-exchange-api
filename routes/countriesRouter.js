import { Router } from "express";
import getAllCountries from "../controllers/getAllCountries.js";
import saveAllCountries from "../controllers/saveAllCountries.js";
import getSummaryImage from "../controllers/getSummaryImage.js";
import getCountryByName from "../controllers/getCountryByName.js";
import Country from "../model/countryModel.js";

const countriesRouter = Router();

//Fetch all countries and exchange rates, then cache them in the database
countriesRouter.post("/refresh", saveAllCountries);

// Get one country by name
countriesRouter.get("/:name", getCountryByName);

// Get all countries from the DB (support filters and sorting) - ?region=Africa | ?currency=NGN | ?sort=gdp_desc
countriesRouter.get("/", getAllCountries);

//  serve summary image
countriesRouter.get("/image", getSummaryImage);

// Delete a country record

countriesRouter.delete("/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const country = await Country.findOne({ where: { name } });

    if (!country) res.status(404).json({ message: "Country not found" });

    await country.destroy();

    res.json({ message: `Country '${name}' deleted successfully.` });
  } catch (error) {
    console.error("Error deleting country:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default countriesRouter;
