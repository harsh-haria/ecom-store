const { text } = require('body-parser');
const Sequelize = require('sequelize');

const sequelize = require('../util/db');

const User = sequelize.define('user',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = User;