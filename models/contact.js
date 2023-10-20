'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    contact.belongsTo(models.user,{foreignKey:'user_id',as:'user' })
    contact.hasMany(models.contactDetails,{foreignKey:'contact_id',as:'contactDetails'})

    }
  }
  contact.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userId:DataTypes.UUID
  }, {
    sequelize,
    modelName: 'contact',
    underscored: true,
    paranoid:true
  });
  return contact;
};