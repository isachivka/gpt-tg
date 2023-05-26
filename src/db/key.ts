import { DataTypes, InferAttributes, Model, Sequelize } from 'sequelize';

import { User } from './user';

export class Key extends Model<InferAttributes<Key>, InferAttributes<Key>> {
  id: number;
  telegramId: number;
  token: string;
  comment: string;
  users?: User[];

  static associate() {}
}

export const initKey = (sequelize: Sequelize) => {
  Key.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      comment: DataTypes.STRING,
      telegramId: DataTypes.BIGINT,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'key',
    }
  );
};
