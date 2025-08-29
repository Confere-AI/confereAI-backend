require("reflect-metadata");
const { DataSource } = require("typeorm");
const User = require("./entity/User");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User],
});

module.exports = AppDataSource;
