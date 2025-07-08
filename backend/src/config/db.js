import {neon} from '@neondatabase/serverless'

import 'dotenv/config';


//creates a connection to the Neon database using the DATABASE_URL from environment variables
// and exports the sql object for use in other parts of the application.
export const sql = neon(process.env.DATABASE_URL);

//initializes the database by creating a transactions table if it does not already exist.
export async function initDB() {

  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,   
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Database initialized successfully.");

  }catch (error) {
    console.error("Error initializing the database:", error);
    process.exit(1); // 1 status code indicates failure while 0 indicates success 
  }
}
