# Country Currency Exchange API

Lightweight RESTful API that fetches country data from restcountries.com, matches currencies with exchange rates from open.er-api.com, computes an estimated GDP for each country, caches records in MySQL, and exposes CRUD and utility endpoints including an image summary.

Live: https://country-currency-exchange-api-production-e7c8.up.railway.app

---

## Features

- POST /countries/refresh — fetch countries & exchange rates, cache to DB (atomic)
- GET /countries — list countries (filter by region, currency; sort by gdp_desc)
- GET /countries/:name — get single country (by name, case-insensitive)
- DELETE /countries/:name — delete a country record
- GET /status — total countries and last refresh timestamp
- GET /countries/image — serve generated summary image (cache/summary.png)

Validation:

- name, population, currency_code required (400 on validation failure)
  Error formats: JSON-only, consistent { error: "...", details: {...} } where applicable.

---

## Prerequisites

- Node.js 18+ and npm
- MySQL server
- Optional: Git, curl, Postman

---

## Setup

1. Clone / open project

```powershell
git clone <repo-url> c:\Users\ACER\Desktop\country-currency-exchange-api
cd c:\Users\ACER\Desktop\country-currency-exchange-api
```

2. Install dependencies

```powershell
npm install
```

3. Create .env in project root (example)

```env
# filepath: .env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_db_password
DB_NAME=country_api
PORT=3000
NODE_ENV=development
```

4. Create the MySQL database (example)

```sql
CREATE DATABASE country_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Ensure project models are synced to DB

- If the project uses Sequelize sync at startup, the tables will be created automatically.
- If not, run migrations or add a small script to sync models:

```javascript
// Run once or ensure index.js calls this:
import { sequelize } from "./config/database.js";
await sequelize.sync({ alter: true });
```

6. Create required directories

```powershell
mkdir cache
```

---

## Running

Development:

```powershell
npm run dev   # if nodemon configured
# or
npm start
```

Server will use PORT from .env or default (3000). Visit: http://localhost:3000

---

## Common Commands / Quick Tests

Refresh data:

```powershell
curl -X POST http://localhost:3000/countries/refresh
```

List countries (filter and sort examples):

```powershell
curl "http://localhost:3000/countries?region=Africa"
curl "http://localhost:3000/countries?currency=NGN"
curl "http://localhost:3000/countries?sort=gdp_desc"
```

Get status:

```powershell
curl http://localhost:3000/status
```

Get summary image:

```powershell
curl http://localhost:3000/countries/image --output summary.png
```

---

## Notes on Implementation & Troubleshooting

- ERR_MODULE_NOT_FOUND for services/refreshData.js
  - Ensure `services/refreshData.js` exists and is exported as an ES module (export default or named export used by controller).
  - Confirm import path in controllers/saveAllCountries.js matches file location:
    ```javascript
    import refreshData from "../services/refreshData.js";
    ```
- Validation errors must return 400 with details:
  ```json
  {
    "error": "Validation failed",
    "details": { "currency_code": "is required" }
  }
  ```
- External API failures should return 503 and must NOT modify DB (use DB transactions or staging table).
- Image summary saved to `cache/summary.png`. GET /countries/image should serve that file or return:
  ```json
  { "error": "Summary image not found" }
  ```

---

## Additional Development Tips

- Use dotenv: ensure `import 'dotenv/config'` or `dotenv.config()` runs before reading process.env.
- Ensure currency handling follows spec:
  - Use first currency code if multiple.
  - If currencies empty → currency_code=null, exchange_rate=null, estimated_gdp=0.
  - If exchange rate missing in rates API → exchange_rate=null, estimated_gdp=null.
- Upsert/update logic should match countries by name case-insensitively.
- Generate a new random multiplier (1000–2000) for each country on every refresh.
- Wrap the entire refresh workflow in a DB transaction; on error, rollback and return 503.

---

## Production / Deployment

- Use environment variables in deployment (Railway, Heroku, etc.).
- Ensure DB credentials and ports are configured securely.
- For large data fetches consider background jobs and timeouts for external API calls.
