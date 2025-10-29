import path from "path";
import fs from "fs";

const getSummaryImage = (req, res) => {
  const imagePath = path.join(process.cwd(), "cache", "summary.png");

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({
      error: "Summary image not found",
    });
  }

  res.sendFile(imagePath);
};

export default getSummaryImage;
