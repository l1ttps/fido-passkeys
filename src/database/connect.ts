import { DataSource } from "typeorm";
import { User } from "../api/users/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [],
  ssl: true,
});

/**
 * Connects to the database.
 *
 * @return {Promise<void>} Promise that resolves when the database is connected.
 */
export default async function connectDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");
  } catch (e) {
    console.log(e);
  }
}
