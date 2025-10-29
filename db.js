import { Sequelize } from "sequelize";
import "dotenv/config";

const connectionUrl =
  (process.env.DATABASE_URL && process.env.DATABASE_URL.trim()) ||
  (process.env.MYSQL_URL && process.env.MYSQL_URL.trim()) ||
  (() => {
    const host = process.env.DB_HOST && process.env.DB_HOST.trim();
    if (!host) return undefined;
    const user = encodeURIComponent(
      (process.env.DB_USERNAME || process.env.DB_USER || "").trim()
    );
    const pass = encodeURIComponent(
      (process.env.DB_PASSWORD || process.env.DB_PASS || "").trim()
    );
    const db = (process.env.DB_DATABASE || process.env.DB_NAME || "").trim();
    const port = process.env.DB_PORT ? `:${process.env.DB_PORT.trim()}` : "";
    return `mysql://${user}:${pass}@${host}${port}/${db}`;
  })();

if (!connectionUrl) {
  throw new Error(
    "No DB connection info found. Set DATABASE_URL or MYSQL_URL or DB_HOST/DB_USERNAME/DB_PASSWORD/DB_DATABASE in env."
  );
}

export const sequelize = new Sequelize(connectionUrl, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};
