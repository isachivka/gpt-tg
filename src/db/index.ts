import { Sequelize } from "sequelize";
import cfg from "./config";
import { User, initUser } from "./user";
import { Key, initKey } from "./key";

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
initKey(sequelize);

const db = {
  User,
  Key,
};

export default db;
