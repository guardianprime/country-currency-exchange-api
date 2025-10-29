import Country from "../model/countryModel.js";

const getCountryByName = async (req, res) => {
  try {
    const { name } = req.params;

    const country = await Country.findOne({
      where: { name },
    });

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res.json(country);
  } catch (error) {
    console.error("Error fetching country:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default getCountryByName;
