"use strict";

module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define("Application", {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jobOpeningId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        "Applied",
        "Shortlisted",
        "Selected",
        "Rejected"
      ),
      allowNull: false,
      defaultValue: "Applied"
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  Application.associate = (models) => {
    Application.belongsTo(models.Student, {
      foreignKey: "studentId"
    });

    Application.belongsTo(models.JobOpening, {
      foreignKey: "jobOpeningId"
    });
  };

  return Application;
};