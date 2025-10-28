import express from "express";
import countriesRouter from "./routes/countriesRouter.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/countries", countriesRouter);

// Show total countries and last refresh timestamp
app.get("/status", (req, res) => {
  res.send("Show total countries and last refresh timestamp");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
