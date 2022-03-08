const Sequelize = require('sequelize');

const sequelize = new Sequelize('latihan', 'postgres', 'root', {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432
});

module.exports = sequelize;