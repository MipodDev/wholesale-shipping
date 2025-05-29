const express = require("express");
const path = require("path"); // Needed for path handling
require("dotenv").config();
const colors = require("colors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(colors.bold.blue(`Server is running on port ${PORT}`));
  });

  const shutdownHandler = () => {
    console.log(colors.bold.red("Shutting down the server..."));
    server.close(() => {
      console.log(colors.bold.red("Server shutdown complete."));
      setTimeout(() => process.exit(0), 5000); // Force shutdown after 5 seconds
    });
  };

  process.on("SIGTERM", shutdownHandler);
  process.on("SIGINT", shutdownHandler);
};

startServer();
