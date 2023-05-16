import { DataTypes, InferAttributes, Model, Sequelize } from "sequelize";

export class User extends Model<InferAttributes<User>, InferAttributes<User>> {
  userId: number;
  chatId: number;
  auth: boolean;
  token: string;
  static associate() {}
}

export const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      userId: DataTypes.BIGINT,
      chatId: DataTypes.BIGINT,
      auth: DataTypes.BOOLEAN,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
};
