import mysql from "mysql";

// 创建连接对象
const db = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "0618",
  database: "my_db_01",
  charset: "utf8mb4", // 支持emoji😄
});

export default db;
