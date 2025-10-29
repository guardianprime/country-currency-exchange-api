import Country from "../model/countryModel";

async function validateInput(req, res) {
  try {
    const country = await Country.create(req.body);
    res.status(201).json(country);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const details = {};
      error.errors.forEach((err) => {
        details[err.path] = err.message;
      });
      return res.status(400).json({
        error: "Validation failed",
        details,
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
