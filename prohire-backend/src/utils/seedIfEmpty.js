const { User, Professional, Category, Service, Hire, Setting, Connection, Job, sequelize } = require('../models');

async function seedIfEmpty() {
  const transaction = await sequelize.transaction();

  try {
    const userCount = await User.count({ transaction });

    if (userCount > 0) {
      const setting = await Setting.findByPk(1, { transaction });
      if (!setting) {
        await Setting.upsert(
          { id: 1, platformName: 'ProHire', commissionRate: 10 },
          { transaction }
        );
      }

      await transaction.commit();
      return;
    }

    console.log("Seeding database...");

    // Example (keep rest same, just add { transaction })
    const dev = await Category.create({
      name: 'Development',
      description: 'Software services'
    }, { transaction });

    // 👉 IMPORTANT: Add { transaction } to ALL create calls
    // (keep your existing logic, just add transaction param)

    await transaction.commit();
    console.log("Seeding completed successfully");

  } catch (error) {
    await transaction.rollback();
    console.error("Seeding failed:", error);
    throw error;
  }
}

module.exports = { seedIfEmpty };
