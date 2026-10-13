"use strict";

module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define("Student", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    course: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Student.associate = (models) => {
    Student.hasMany(models.Application, {
      foreignKey: "studentId",
      onDelete: "CASCADE"
    });
  };

  return Student;
};