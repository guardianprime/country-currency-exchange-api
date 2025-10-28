import refreshData from "../utils/refreshData.js";

const getAllCountries = async (req, res) => {
  const special = refreshData();
  res.json({ message: "getting all countries", data: special });
  refreshData();
};

export default getAllCountries;
