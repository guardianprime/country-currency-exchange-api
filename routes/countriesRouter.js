import { Router } from "express";

const countriesRouter = Router();

//Fetch all countries and exchange rates, then cache them in the database
countriesRouter.post("/refresh", (req, res) => {
  res.send("POST /countries/refresh route");
});

// Get all countries from the DB (support filters and sorting) - ?region=Africa | ?currency=NGN | ?sort=gdp_desc

countriesRouter.get("/", (req, res) => {
  res.send("/countries get route");
});

//  serve summary image
countriesRouter.get("/image", (req, res) => {
  res.send("/countries/image get route");
});

// Get one country by name
countriesRouter.get("/:name", (req, res) => {
  res.send("/countries/:name get route");
});

// Delete a country record

countriesRouter.delete("/:name", (req, res) => {
  res.send("/countries/:name delete route");
});

export default countriesRouter;
