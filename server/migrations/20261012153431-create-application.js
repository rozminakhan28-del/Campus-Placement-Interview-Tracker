"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Applications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Students",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      jobOpeningId: {
  type: Sequelize.INTEGER,
  allowNull: false,
  references: {
    model: "JobOpenings",
    key: "id"
  },
  onUpdate: "CASCADE",
  onDelete: "CASCADE"
},
      status: {
        type: Sequelize.ENUM(
          "Applied",
          "Shortlisted",
          "Selected",
          "Rejected"
        ),
        allowNull: false,
        defaultValue: "Applied"
      },
      appliedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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

    await queryInterface.addConstraint("Applications", {
      fields: ["studentId", "jobOpeningId"],
      type: "unique",
      name: "unique_student_job_application"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Applications");
  }
};