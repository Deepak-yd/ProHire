const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Job = sequelize.define('Job', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    professionalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    skills: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const val = this.getDataValue('skills');
        return typeof val === 'string' ? JSON.parse(val) : val || [];
      },
      set(val) {
        this.setDataValue('skills', typeof val === 'string' ? JSON.parse(val) : val);
      },
    },
    budget: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'completed', 'closed'),
      defaultValue: 'open',
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Job;
};
