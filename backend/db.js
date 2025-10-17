import sqlite3 from "sqlite3";
import { open } from "sqlite";


export const db = await open({
  filename: "./users.db",
  driver: sqlite3.Database,
});


await db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  dob TEXT,
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS followers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  follower_id INTEGER,
  following_id INTEGER
);
`);
