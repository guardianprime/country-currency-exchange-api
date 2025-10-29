import express from "express";
import countriesRouter from "./routes/countriesRouter.js";
import { connectDB, sequelize } from "./db.js";
import Country from "./model/countryModel.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

connectDB();
await sequelize.sync({ alter: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/countries", countriesRouter);

// Show total countries and last refresh timestamp
app.get("/status", async (req, res) => {
  try {
    const total = await Country.count();
    const lastRefreshed = await Country.max("last_refreshed_at");
    res.json({
      total_countries: total,
      last_refreshed_at: lastRefreshed,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
