const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const WebhookURL = sequelize.define('WebhookURL', {
	url_slug: {
	  type: DataTypes.STRING,
	  unique: true,
	  allowNull: false
	},
	description: {
	  type: DataTypes.TEXT,
	}
});

User.hasMany(WebhookURL, { foreignKey: 'user_id' });
WebhookURL.belongsTo(User, { foreignKey: 'user_id' });

module.exports = WebhookURL;
