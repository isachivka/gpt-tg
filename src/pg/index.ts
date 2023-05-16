import { Sequelize } from "sequelize";
import cfg from "./config";
import { User, initUser } from "./user";

const env =
  (process.env.NODE_ENV as "development" | "production") ||
  ("development" as const);

const config = {
  ...cfg[env],
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

initUser(sequelize);

const db = {
  User,
};

export default db;
