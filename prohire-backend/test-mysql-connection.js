#!/usr/bin/env node
/**
 * MySQL Connection Test Script
 * Run with: node test-mysql-connection.js
 * 
 * This script tests if the MySQL database connection is working
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

async function testConnection() {
  console.log('\n🔍 Testing MySQL Connection...\n');

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL environment variable not set');
    console.log('   Please set DATABASE_URL in .env file');
    console.log('   Example: DATABASE_URL=mysql://root:password@localhost:3306/prohire');
    process.exit(1);
  }

  console.log('📝 Connection String:', databaseUrl.replace(/:[^@]*@/, ':****@'));

  try {
    console.log('⏳ Connecting to MySQL...');

    const sequelize = new Sequelize(databaseUrl, {
      logging: false,
      define: { timestamps: true },
    });

    await sequelize.authenticate();
    console.log('✅ Connection successful!');

    // Get database info
    const result = await sequelize.query("SELECT DATABASE() as current_database;", 
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (result && result[0]) {
      console.log(`✅ Current Database: ${result[0].current_database}`);
    }

    // Check tables
    const tables = await sequelize.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE();",
      { type: sequelize.QueryTypes.SELECT }
    );

    console.log(`✅ Tables in database: ${tables.length}`);
    if (tables.length > 0) {
      tables.forEach((table) => {
        console.log(`   - ${table.TABLE_NAME}`);
      });
    } else {
      console.log('   (No tables yet - they will be created on app startup)');
    }

    await sequelize.close();

    console.log('\n✅ Database is ready to use!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Connection Error:', err.message);

    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('   → MySQL server connection was closed');
      console.error('   → Make sure MySQL is running');
    } else if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
      console.error('   → MySQL connection had fatal error');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   → Access denied - check username/password');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('   → Database does not exist');
      console.error('   → Create it with: mysql -u root -p -e "CREATE DATABASE prohire;"');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('   → Connection refused - MySQL might not be running');
      console.error('   → Make sure MySQL service is started');
    }

    console.error('\n📋 Troubleshooting steps:');
    console.error('   1. Check if MySQL is installed: mysql --version');
    console.error('   2. Start MySQL service');
    console.error('   3. Create database: mysql -u root -p -e "CREATE DATABASE prohire;"');
    console.error('   4. Update DATABASE_URL in .env with correct password');
    console.error('   5. Run this script again\n');

    process.exit(1);
  }
}

testConnection();
