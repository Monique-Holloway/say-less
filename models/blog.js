'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.user = Blog.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
    }
  }
  Blog.init({
    user_id: DataTypes.INTEGER,
    image: DataTypes.TEXT,
    title: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Blog',
  });
  return Blog;
};