-- MySQL Database Setup Script for ProHire
-- Run this script in MySQL to create and initialize the prohire database

-- Create the database
CREATE DATABASE IF NOT EXISTS prohire;
USE prohire;

-- NOTE: Sequelize will automatically create all tables from models
-- You just need to:
-- 1. Create the database (done above)
-- 2. Run the Node.js application which will sync the models
-- 3. The seed data will be automatically inserted on first run

-- Verify the database was created
SELECT 'Database prohire created successfully!' as Status;
