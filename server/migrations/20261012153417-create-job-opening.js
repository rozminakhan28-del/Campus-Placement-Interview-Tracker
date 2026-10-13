"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("JobOpenings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      salary: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Companies",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("JobOpenings");
  }
};