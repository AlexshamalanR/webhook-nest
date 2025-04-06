const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('Successfully connected to MySQL server');

    // Try to create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created or already exists`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log(`Using database ${process.env.DB_NAME}`);

    await connection.end();
    console.log('Connection closed successfully');
  } catch (err) {
    console.error('Error:', err);
  }
}

testConnection(); 