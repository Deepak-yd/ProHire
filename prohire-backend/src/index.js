require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { sequelize } = require('./models/index-fixed');
const { seedIfEmpty } = require('./utils/seedIfEmpty');

const authRoutes = require('./routes/auth');
const professionalsRoutes = require('./routes/professionals');
const servicesRoutes = require('./routes/services');
const hiresRoutes = require('./routes/hires');
const categoriesRoutes = require('./routes/categories');
const usersRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const reportsRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');
const connectionsRoutes = require('./routes/connections');
const jobsRoutes = require('./routes/jobs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalsRoutes);
app.use('/api/professionals/:professionalId/services', servicesRoutes);
app.use('/api/hires', hiresRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/jobs', jobsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    await seedIfEmpty();
    console.log('Database connected.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

start();
