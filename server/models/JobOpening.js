"use strict";

module.exports = (sequelize, DataTypes) => {
  const JobOpening = sequelize.define("JobOpening", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  JobOpening.associate = (models) => {
    JobOpening.belongsTo(models.Company, {
      foreignKey: "companyId"
    });

    JobOpening.hasMany(models.Application, {
      foreignKey: "jobOpeningId",
      onDelete: "CASCADE"
    });
  };

  return JobOpening;
};