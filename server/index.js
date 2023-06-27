require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const fileUpload = require("express-fileupload");
const path = require("path");

const models = require("./dao/models");
const routes = require("./routes/index");
const errorHandle = require("./middleware/ErrorHandle");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));

app.use("/api", routes);

app.use(errorHandle);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log("This server started to PORT: " + PORT));
  } catch (e) {
    console.log(e);
  }
};

startServer();
