import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./src/entities/User";
import { Software } from "./src/entities/Software";
import { Request } from "./src/entities/Request";
import * as dotenv from "dotenv";
dotenv.config();
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Auto-create tables in development
  logging: true, // Show SQL queries
  entities: [User, Software, Request],
  migrations: [],
  subscribers: [],
});
