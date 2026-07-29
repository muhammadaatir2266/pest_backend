# Farmers Pest Detection Backend API

RESTful API backend for the Farmers Pest Detection & Identification Mobile Application. Built with Node.js, Express, Prisma ORM, PostgreSQL, JWT Authentication, and Hugging Face ML Vision model integration.

## Features

- **Pest Identification**: Integrated Hugging Face Vision model for classifying uploaded pest photos.
- **Agricultural Database**: Stores pests, scientific names, affected crops, damage severity, and organic & chemical pesticide recommendations with dosage and safety instructions.
- **Authentication**: Email/Password, Phone OTP, Refresh Tokens, and Guest Login.
- **Image Processing**: Multer file uploads with validation and static file hosting.
- **API Documentation**: Interactive Swagger OpenAPI UI (`/api-docs`).
- **Security & Logging**: Express rate limiting, CORS configuration, Joi payload validation, Winston logger, and centralized error handling.
- **Deployment Ready**: Fully configured for 1-click deployment on **Railway**.

## Prerequisites

- Node.js (v18+)
- PostgreSQL database server (Local or Railway Postgres Plugin)

## Setup Instructions (Local)

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and set your PostgreSQL connection string and Hugging Face API key:
   ```bash
   cp .env.example .env
   ```

3. **Database Migration & Seeding**:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Access API Documentation**:
   Open [http://localhost:5000/api-docs](http://localhost:5000/api-docs) in your browser.

---

## Deploying to Railway (Step-by-Step)

### Option 1: Deploy via Railway CLI / GitHub

1. **Create a New Project on Railway**:
   - Go to [railway.app](https://railway.app) and create a new project.
   - Click **+ New** -> **Database** -> **Add PostgreSQL**.

2. **Connect the Backend Repository**:
   - Click **+ New** -> **GitHub Repo** and select the `/backend` directory (or push the code).
   - Railway will automatically detect Node.js using `nixpacks.toml` or `railway.json`.

3. **Set Environment Variables in Railway**:
   Under the service **Variables** tab, add:
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}` *(automatically provided by Railway Postgres)*
   - `JWT_SECRET`: `super_secret_farmers_pest_jwt_key_2026`
   - `JWT_REFRESH_SECRET`: `super_secret_refresh_token_key_2026`
   - `HUGGINGFACE_API_KEY`: *(Optional: your Hugging Face API token)*
   - `HUGGINGFACE_MODEL`: `underdogquality/yolo11s-pest-detection`
   - `NODE_ENV`: `production`

4. **Automatic Build & Seed**:
   Railway will execute:
   - Build phase: `npm install && npx prisma generate`
   - Start phase: `npx prisma db push && node prisma/seed.js && node src/server.js`

5. **Deploy & Generate Domain**:
   - Click **Settings** -> **Networking** -> **Generate Domain**.
   - Your API will be live at `https://your-app-name.up.railway.app/api-docs`.

## Run Tests

```bash
npm test
```
