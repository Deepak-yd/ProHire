const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Hire = sequelize.define('Hire', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    professionalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    serviceTitle: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    professionalName: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Completed', 'Pending', 'Cancelled'),
      defaultValue: 'Pending',
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
  });

  return Hire;
};
