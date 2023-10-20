'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contactDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      contactDetails.belongsTo(models.contact,{foreignKey:'contact_id',as:'contact' })
    }
  }
  contactDetails.init({
    type: DataTypes.STRING,
    contactNumber: DataTypes.STRING,
    contactId:DataTypes.UUID
  }, {
    sequelize,
    modelName: 'contactDetails',
    tableName:'contactDetails',
    underscored: true,
    paranoid:true
  });
  return contactDetails;
};