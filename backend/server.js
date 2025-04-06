const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const User = require('./models/User');
const WebhookURL = require('./models/WebhookURL');
const WebhookLog = require('./models/WebhookLog');
const authRoutes = require('./routes/authRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const webhookReceiver = require('./routes/webhookReceiver');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Detailed request logging middleware
app.use((req, res, next) => {
	console.log('--------------------');
	console.log('New Request:');
	console.log(`Time: ${new Date().toISOString()}`);
	console.log(`Method: ${req.method}`);
	console.log(`URL: ${req.url}`);
	console.log(`Headers:`, req.headers);
	console.log(`Body:`, req.body);
	console.log('--------------------');
	next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/receive', webhookReceiver);

// Health check route
app.get('/', (req, res) => {
	res.send('WebhookNest backend is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error('Global error handler:', err);
	res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
	console.log(`404 Not Found: ${req.method} ${req.url}`);
	res.status(404).json({ message: 'Route not found' });
});

// Database connection and server startup
console.log('Connecting to database...');
sequelize.authenticate()
	.then(() => {
		console.log('🟢 MySQL connected successfully');
		console.log('Syncing database models...');
		// Sync without forcing to preserve data
		return sequelize.sync();
	})
	.then(() => {
		console.log('✅ Database models synced successfully');
		app.listen(PORT, () => {
			console.log(`🚀 Server started on port ${PORT}`);
			console.log('Available routes:');
			console.log('  - POST /api/auth/register');
			console.log('  - POST /api/auth/login');
			console.log('  - GET /api/webhooks');
			console.log('  - POST /api/webhooks/create');
			console.log('  - GET /api/webhooks/:slug');
		});
	})
	.catch(err => {
		console.error('🔴 Database connection error:', err);
		process.exit(1);
	});
