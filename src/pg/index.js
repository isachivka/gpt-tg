import Sequelize from "sequelize";
import cfg from "../../database/config";
import user from "./user";

const db = {};
const env = process.env.NODE_ENV || "development";
const config = {
  ...cfg[env],
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.user = user(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
