const serverless = require("serverless-http");
const app = require("./app");
const { pool } = require("./config/db");

let isConnected = false;

async function connectToPostgres() {
  if (isConnected) return;

  try {
    await pool.query("SELECT 1");
    isConnected = true;
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    throw err;
  }
}

const handler = async (req, res) => {

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.status(200).end();
  }

  try {
    await connectToPostgres();
  } catch (err) {
    return res.status(503).json({ error: "Database unavailable" });
  }

  return app(req, res);
};

module.exports = serverless(handler);