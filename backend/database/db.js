const { Sequelize } = require("sequelize");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to connect to the Neon PostgreSQL database.");
}

// Keep Neon connections encrypted and verify both the certificate and hostname.
// Normalize the mode in memory so existing Render/local URLs using `require`
// keep the current pg behavior without emitting the compatibility warning.
const secureDatabaseUrl = new URL(databaseUrl);
secureDatabaseUrl.searchParams.set("sslmode", "verify-full");

const sequelize = new Sequelize(secureDatabaseUrl.toString(), {
  dialect: "postgres",
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
