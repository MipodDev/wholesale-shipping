const express = require("express");
const path = require("path"); // Needed for path handling
require("dotenv").config();
const colors = require("colors");
const { connect, disconnect, ping } = require("./src/utils/db");
const app = express();
const PORT = process.env.PORT || 3000;
const ratesRoute = require("./src/routes/rates.route");
const customersRoute = require("./src/routes/customers.route");
const installationRoute = require("./src/routes/installation.route");

const { test } = require("./src/test/test");
app.use(express.json());

app.use("/api/rates", ratesRoute);
app.use("/api/customers", customersRoute);
app.use("/api/install", installationRoute);


app.get("/test", async (req, res) => {
  await test();
  res.send("request received");
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
