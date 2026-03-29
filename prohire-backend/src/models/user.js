const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {   // ✅ FIX: model name singular
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'professional', 'admin', 'client'),
      defaultValue: 'user',
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active',
    },
    provider: {
      type: DataTypes.STRING,
      defaultValue: 'local',
    },
    phone: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    company: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    website: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    bio: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    linkedIn: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    github: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    twitter: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    portfolio: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
  }, {
    tableName: 'users',        // ✅ FIX: lowercase
    freezeTableName: true,     // ✅ prevent Sequelize changes
    timestamps: true
  });

  // 🔐 Hooks
  User.beforeSave(async (user) => {
    if (!user.username && user.name) {
      let base = user.name.toLowerCase().replace(/\s+/g, '');
      let attempt = base;
      let count = 1;

      while (await User.findOne({ where: { username: attempt } })) {
        attempt = `${base}${count++}`;
      }

      user.username = attempt;
    }

    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // 🔐 Methods
  User.prototype.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  return User;
};
