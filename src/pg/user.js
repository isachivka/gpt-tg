const { Model } = require("sequelize");
const user = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // static associate(models) {
      // define association here
    }
  }
  user.init(
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
  return user;
};

export default user;
