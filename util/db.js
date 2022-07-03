// for mysql2 only
// // const mysql = require('mysql2');

// // const pool = mysql.createPool({
// //     host: "localhost",
// //     user: 'root',
// //     database: 'node-complete',
// //     password: '< Enter your password here >'
// // });

// // module.exports = pool.promise();


//for sequelize
const Sequelize = require('sequelize');

// const sequelize = new Sequelize
const sequelize = new Sequelize('node-complete','rootuser','PassRoot!123',{
    host: 'localhost',
    dialect: 'mysql'
});

// const Product = sequelize.define('product',{
//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title:{
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     price:{
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     imageUrl:{
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     details:{
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });
// console.log('printing equal');
// console.log(Product === sequelize.models.product);

// try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }

module.exports = sequelize;