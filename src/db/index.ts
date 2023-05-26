import { DataTypes, Sequelize } from 'sequelize';

import cfg from './config';
import { Key, initKey } from './key';
import { User, initUser } from './user';

const env =
  (process.env.NODE_ENV as 'development' | 'production') ||
  ('development' as const);

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
Key.hasMany(User, {
  sourceKey: 'token',
  keyType: DataTypes.STRING,
  foreignKey: 'token',
});
User.belongsTo(Key, {
  foreignKey: 'token',
  keyType: DataTypes.STRING,
  targetKey: 'token',
});

const db = {
  User,
  Key,
};

export default db;
