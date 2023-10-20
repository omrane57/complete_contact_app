'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contactDetails', {
      id: {
        allowNull: false,
     
        primaryKey: true,
        type: Sequelize.UUID
      },
      type: {
        type: Sequelize.STRING
      },
      contact_number: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      contact_id:{
        type:Sequelize.UUID,
        references:{
          model:"contacts",
          key:"id"
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contactDetails');
  }
};