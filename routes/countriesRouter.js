import { Router } from "express";
import getAllCountries from "../controllers/getAllCountries.js";
import saveAllCountries from "../controllers/saveAllCountries.js";
import getSummaryImage from "../controllers/getSummaryImage.js";
import getCountryByName from "../controllers/getCountryByName.js";

const countriesRouter = Router();

//Fetch all countries and exchange rates, then cache them in the database
countriesRouter.post("/refresh", saveAllCountries);

// Get all countries from the DB (support filters and sorting) - ?region=Africa | ?currency=NGN | ?sort=gdp_desc
countriesRouter.get("/", getAllCountries);

//  serve summary image
countriesRouter.get("/image", getSummaryImage);

// Get one country by name
countriesRouter.get("/:name", getCountryByName);

// Delete a country record

countriesRouter.delete("/:name", (req, res) => {
  res.send("/countries/:name delete route");
});

export default countriesRouter;
