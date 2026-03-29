const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Professional = sequelize.define('Professional', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: 'Professional',
    },
    rate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    bio: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    skills: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Professional;
};
