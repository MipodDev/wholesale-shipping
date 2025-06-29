// wholesale-shipping/server/server.js

const express = require("express");
const path = require("path");
require("dotenv").config();
const colors = require("colors");
const { connect, disconnect, ping } = require("./src/utils/db");

const app = express();
const PORT = process.env.PORT || 3000;
const ratesRoute = require("./src/routes/rates.route");
const customersRoute = require("./src/routes/customers.route");
const installationRoute = require("./src/routes/installation.route");
const listRoute = require("./src/routes/list.route");
const ruleRoute = require("./src/routes/rule.route");
const stateRoute = require("./src/routes/state.route");
const productsRoute = require("./src/routes/products.route");
const webRoute = require("./src/routes/web.route");
const zipCodeRoute = require("./src/routes/zipCode.route");

// JSON parsing
app.use(express.json());

// API routes
app.use("/api/rates", ratesRoute);
app.use("/api/customers", customersRoute);
app.use("/api/install", installationRoute);
app.use("/api/lists", listRoute);
app.use("/web/rules", ruleRoute);
app.use("/web", webRoute);
app.use("/api/products", productsRoute);
app.use("/api/states", stateRoute);
app.use("/api/zipcode", zipCodeRoute);

// Add /test route BEFORE the fallback
app.get("/test", async (req, res) => {
  await test();
  res.send("request received");
});

const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

// Fallback for SPA routes
app.get("/{/*path}", (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(PORT, async () => {
  console.clear();
  console.log(" ✅ Server is running on port:".bold.green, PORT);
  console.log(` 🌐 Make requests to:`.bold.cyan, `http://localhost:${PORT}`);

  try {
    await connect();
    console.log(" ✅ Database connected successfully".bold.green);
  } catch (error) {
    console.error(" ❌ Database connection failed".bold.red, error);
    process.exit(1);
  }

  process.on("SIGINT", async () => {
    await disconnect();
    console.log(" 🔌 Database disconnected successfully".bold.yellow);
    process.exit(0);
  });

  // Log memory usage every 10 seconds
  // setInterval(() => {
  //   const memoryUsage = process.memoryUsage();
  //   console.log(`***Memory Usage:
  //     *RSS: ${memoryUsage.rss / 1024 / 1024} MB
  //     *Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB
  //     *Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB
  //     *External: ${memoryUsage.external / 1024 / 1024} MB`);
  // }, 10000);
});
