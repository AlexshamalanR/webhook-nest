const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const WebhookURL = require('./WebhookURL');

const WebhookLog = sequelize.define('WebhookLog', {
	  payload: {
		      type: DataTypes.JSON,
		      allowNull: false
		    },
	  headers: {
		      type: DataTypes.JSON,
		    },
	  status_code: {
		      type: DataTypes.INTEGER
		    },
	  received_at: {
		      type: DataTypes.DATE,
		      defaultValue: DataTypes.NOW
		    },
	  replayed: {
		      type: DataTypes.BOOLEAN,
		      defaultValue: false
		    }
});

WebhookURL.hasMany(WebhookLog, { foreignKey: 'webhook_id' });
WebhookLog.belongsTo(WebhookURL, { foreignKey: 'webhook_id' });

module.exports = WebhookLog;

