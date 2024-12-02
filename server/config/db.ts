import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost', // Ändra vid behov
    port: 3306,
    user: 'root',
    password: 'notSecureChangeMe',
    database: 'AdventureRouter',
});

export default pool;
