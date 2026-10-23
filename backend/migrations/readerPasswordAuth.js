const { DataTypes } = require("sequelize");

const COLUMNS = {
  password_hash: { type: DataTypes.STRING(255), allowNull: true },
  reset_password_token_hash: { type: DataTypes.STRING(64), allowNull: true },
  reset_password_expires_at: { type: DataTypes.DATE, allowNull: true },
};

async function ensureReaderPasswordAuth(database) {
  const query = database.getQueryInterface();
  const transaction = await database.transaction();
  try {
    const columns = await query.describeTable("users", { transaction });
    if (!columns.google_sub) throw new Error("users.google_sub is missing; reader auth migration stopped safely.");
    if (columns.google_sub.allowNull === false) {
      await query.changeColumn("users", "google_sub", {
        type: DataTypes.STRING(255), allowNull: true,
      }, { transaction });
    }
    for (const [name, definition] of Object.entries(COLUMNS)) {
      if (!columns[name]) await query.addColumn("users", name, definition, { transaction });
    }
    const indexes = await query.showIndex("users", { transaction });
    if (!indexes.some((index) => index.name === "users_reset_password_token_hash_key")) {
      await query.addIndex("users", ["reset_password_token_hash"], {
        name: "users_reset_password_token_hash_key", unique: true, transaction,
      });
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = ensureReaderPasswordAuth;
