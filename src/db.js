const { Sequelize } = require("sequelize");

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./employees.sqlite",
  logging: false
});

module.exports = { db };
