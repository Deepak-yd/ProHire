const { Sequelize } = require('sequelize');

let sequelize;

// ✅ Use PostgreSQL in production (Render)
if (process.env.DB_URL) {
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // required for Neon/Render
      },
    },
  });
} else {
  // ✅ fallback for local (optional)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
  });
}

// ✅ LOAD MODELS
const User = require('./user')(sequelize);
const Professional = require('./professional')(sequelize);
const Hire = require('./hire')(sequelize);
const Category = require('./category')(sequelize);
const Service = require('./service')(sequelize);
const Setting = require('./setting')(sequelize);
const Connection = require('./connection')(sequelize);
const Job = require('./job')(sequelize);

// ✅ ASSOCIATIONS
User.hasMany(Hire, { foreignKey: 'clientId', as: 'hiresMade' });
Professional.hasMany(Hire, { foreignKey: 'professionalId', as: 'jobs' });
Hire.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
Hire.belongsTo(Professional, { foreignKey: 'professionalId', as: 'professional' });

Category.hasMany(Professional, { foreignKey: 'categoryId', as: 'professionals' });
Professional.belongsTo(Category, { foreignKey: 'categoryId', as: 'categoryObj' });

Professional.hasMany(Service, { foreignKey: 'professionalId', as: 'services' });
Service.belongsTo(Professional, { foreignKey: 'professionalId', as: 'professional' });

User.hasMany(Connection, { foreignKey: 'requesterId', as: 'sentRequests' });
User.hasMany(Connection, { foreignKey: 'receiverId', as: 'receivedRequests' });
Connection.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Connection.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

Professional.hasMany(Job, { foreignKey: 'professionalId', as: 'postedJobs' });
Job.belongsTo(Professional, { foreignKey: 'professionalId', as: 'professional' });

module.exports = {
  sequelize,
  User,
  Professional,
  Hire,
  Category,
  Service,
  Setting,
  Connection,
  Job,
};
