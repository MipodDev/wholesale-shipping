const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const db_username = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const collection = process.env.DB_COLLECTION;

const uri = `mongodb+srv://${db_username}:${db_password}@shopify-integrations.xbkpui0.mongodb.net/${collection}?retryWrites=true&w=majority&appName=shopify-integrations`;

const clientOptions = {
  serverApi: { version: "1", strict: false, deprecationErrors: true },
};

async function connect() {
  await mongoose.connect(uri, clientOptions);
  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log(" 🤝 Pinged your deployment!".green);
}

async function disconnect() {
  await mongoose.disconnect();
}

async function ping() {
  try {
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.log("Error pinging MongoDB: ", error);
  }
}

module.exports = { connect, disconnect, ping };
