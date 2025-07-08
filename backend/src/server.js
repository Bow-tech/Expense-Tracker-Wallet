import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionsRoute from "./routes/transactionsRoute.js";

import job  from "./config/cron.js";  // Import cron jobs configuration

dotenv.config();

const app = express();

// Start the cron job only if the environment is production
if (process.env.NODE_ENV === "production") job.start(); // Start the cron job to send GET requests every 14 minutes


//middleware

app.use(rateLimiter); // Apply rate limiting middleware
app.use(express.json()); // to parse JSON request bodies

const PORT = process.env.PORT || 3000;

//route to check if our api is working fine 
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Ok"});
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
  });
});
