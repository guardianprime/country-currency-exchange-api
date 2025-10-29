import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateSummaryImage = async (
  totalCountries,
  topCountries,
  timestamp
) => {
  try {
    // Create canvas
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Country Data Summary", width / 2, 60);

    // Total Countries
    ctx.font = "24px Arial";
    ctx.fillStyle = "#16c79a";
    ctx.fillText(`Total Countries: ${totalCountries}`, width / 2, 120);

    // Top 5 Countries Header
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px Arial";
    ctx.fillText("Top 5 Countries by Estimated GDP", width / 2, 180);

    // Draw Top 5 Countries
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    let yPosition = 230;

    topCountries.forEach((country, index) => {
      // Rank circle
      ctx.fillStyle = "#16c79a";
      ctx.beginPath();
      ctx.arc(100, yPosition, 15, 0, Math.PI * 2);
      ctx.fill();

      // Rank number
      ctx.fillStyle = "#1a1a2e";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(index + 1, 100, yPosition + 5);

      // Country name
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px Arial";
      ctx.textAlign = "left";
      ctx.fillText(country.name, 130, yPosition + 5);

      // GDP value
      ctx.fillStyle = "#a8dadc";
      const gdpFormatted = country.estimated_gdp
        ? `$${(country.estimated_gdp / 1e9).toFixed(2)}B`
        : "N/A";
      ctx.fillText(gdpFormatted, 500, yPosition + 5);

      yPosition += 50;
    });

    // Timestamp
    ctx.fillStyle = "#6c757d";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `Last Refreshed: ${new Date(timestamp).toLocaleString()}`,
      width / 2,
      height - 40
    );

    // Ensure cache directory exists
    const cacheDir = path.join(process.cwd(), "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Save image
    const buffer = canvas.toBuffer("image/png");
    const imagePath = path.join(cacheDir, "summary.png");
    fs.writeFileSync(imagePath, buffer);

    console.log("Summary image generated successfully");
    return imagePath;
  } catch (err) {
    console.error("Failed to generate image:", err);
    throw err;
  }
};

export default generateSummaryImage;
