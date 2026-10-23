require("dotenv").config();
const sequelize = require("../database/db");
const ensureReaderPasswordAuth = require("../migrations/readerPasswordAuth");

ensureReaderPasswordAuth(sequelize)
  .then(() => console.log("Reader password authentication schema is ready."))
  .catch((error) => {
    console.error("Reader authentication migration failed:", error.name || "UnknownError");
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
