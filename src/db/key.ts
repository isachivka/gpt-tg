import { DataTypes, InferAttributes, Model, Sequelize } from "sequelize";

export class Key extends Model<InferAttributes<Key>, InferAttributes<Key>> {
  telegramId: number;
  token: string;
  static associate() {}
}

export const initKey = (sequelize: Sequelize) => {
  Key.init(
    {
      telegramId: DataTypes.BIGINT,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "key",
    }
  );
};
