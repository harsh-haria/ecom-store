const { SequelizeScopeError } = require('sequelize');
const Sequelize = require('sequelize');

const sequelize = require('../util/db.js');

const Product = sequelize.define('product',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    price:{
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl:{
        type: Sequelize.STRING,
        allowNull: false
    },
    details:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;