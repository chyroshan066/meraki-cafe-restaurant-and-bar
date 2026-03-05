const http = require("http");
const app = require("./app");
const { pool } = require("./config/db");

const PORT = process.env.PORT || 5000;

let isConnected = false;

// async function startServer() {
//   try {
//     // Verify database connection on startup for easier debugging
//     await pool.query('SELECT 1');
//     const server = http.createServer(app);

//     server.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//       console.log('Database connection successful');
//     });
//   } catch (err) {
//     console.error('Failed to start server due to database connection error:', err.message);
//     process.exit(1);
//   }
// }

async function connectToPostgres() {
  try {
    // Verify database connection on startup for easier debugging
    await pool.query("SELECT 1");
    isConnected = true;
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    isConnected = false;
    throw err;
  }
}

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectToPostgres();
    } catch (err) {
      return res.status(503).json({ error: "Database unavailable" });
    }
  }
  next();
});

// startServer();

//don't use app.listen() in vercel.json
module.exports = app;
