const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Setting = sequelize.define('Setting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: 1,
    },
    platformName: {
      type: DataTypes.STRING,
      defaultValue: 'ProHire',
    },
    commissionRate: {
      type: DataTypes.FLOAT,
      defaultValue: 10,
    },
  });

  return Setting;
};
