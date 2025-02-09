import pkg from "pg"; // Import the entire module as pkg
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg; // Destructure Pool from the imported module

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

export default pool;
