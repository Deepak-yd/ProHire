const { sequelize } = require('./models');
const { seedIfEmpty } = require('./utils/seedIfEmpty');

async function run() {
  await sequelize.sync({ alter: true });
  await seedIfEmpty();
  console.log('Seed complete');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
