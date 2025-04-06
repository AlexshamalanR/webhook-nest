const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
	name: {
	  type: DataTypes.STRING,
	  allowNull: true
	},
	email: {
	  type: DataTypes.STRING,
	  unique: true,
	  allowNull: false
	},
	password: {
	  type: DataTypes.STRING,
	  allowNull: false
	},
	api_key: {
	  type: DataTypes.STRING,
	  unique: true,
	  allowNull: false
	}
});

module.exports = User;

