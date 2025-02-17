import mysql from 'mysql2/promise.js';

// create a connection
const pool = await mysql.createPool({
  connectionLimit: 10,
  database: 'home_listings',
  host: 'localhost',
  port: 3306,
  user: 'webprog',
  password: 'admin',
});

// create the necessary tables
try {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS Users(
        Username VARCHAR(50) PRIMARY KEY,
        Phone VARCHAR(15),
        Password VARCHAR(300));`,
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS Listings(
        ListingID INT PRIMARY KEY AUTO_INCREMENT,
        City VARCHAR(50),
        District VARCHAR(50),
        Area DOUBLE,
        Rooms INT,
        Price DOUBLE,
        Date DATE,
        Username VARCHAR(50),
        FOREIGN KEY (Username) REFERENCES Users(Username));`,
  );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS Pictures(
        ListingID INT,
        Picture VARCHAR(100),
        FOREIGN KEY (ListingID) REFERENCES Listings(ListingID),
        PRIMARY KEY(ListingID, Picture));`,
  );

  // temporary solution for an admin user
  await pool.query("DELETE FROM Users WHERE Username = 'admin'");
  await pool.query(`INSERT INTO Users (Username, Password) 
                  VALUES ('admin', '$2b$10$DW7Dp0bzSBwX4KfNJP4lZOzPrG7cPfdtFANV9D1w7qFjCunGJmVJG')`);

  console.log('Tables created successfully');
} catch (err) {
  console.error(`Create table error: ${err}`);
  process.exit(1);
}

export default pool;
