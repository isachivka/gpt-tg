import { DataTypes, InferAttributes, Model, Sequelize } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferAttributes<User>> {
  id: number;
  userId: number;
  auth: boolean;
  token: string;
  static associate() {}
}

export const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: DataTypes.BIGINT,
      auth: DataTypes.BOOLEAN,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'user',
    }
  );
};
