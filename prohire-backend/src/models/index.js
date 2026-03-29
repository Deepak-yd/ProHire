const { Sequelize } = require('sequelize');

let sequelize;

// ✅ PostgreSQL (Neon)
sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Models
const User = require('./user')(sequelize);
const Professional = require('./professional')(sequelize);
const Hire = require('./hire')(sequelize);
const Category = require('./category')(sequelize);
const Service = require('./service')(sequelize);
const Setting = require('./setting')(sequelize);
const Connection = require('./connection')(sequelize);
const Job = require('./job')(sequelize);

// Relationships
User.hasMany(Hire, { foreignKey: 'clientId', as: 'hiresMade' });
Professional.hasMany(Hire, { foreignKey: 'professionalId', as: 'jobs' });
Hire.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
Hire.belongsTo(Professional, { foreignKey: 'professionalId', as: 'professional' });

Category.hasMany(Professional, { foreignKey: 'categoryId', as: 'professionals' });
Professional.belongsTo(Category, { foreignKey: 'categoryId', as: 'categoryObj' });

Professional.hasMany(Service, { foreignKey: 'professionalId', as: 'services' });
Service.belongsTo(Professional, { foreignKey: 'professionalId', as: 'professional' });

// connections
User.hasMany(Connection, { foreignKey: 'requesterId', as: 'sentRequests' });
User.hasMany(Connection, { foreignKey: 'receiverId', as: 'receivedRequests' });
Connection.belongsTo(User, { foreignKey: 'requesterId', as: 'requester' });
Connection.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

// Jobs
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
