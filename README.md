# WebhookNest

A modern webhook management system built with Node.js, Express, React, and MySQL. This application allows users to create, manage, and monitor webhooks with a beautiful user interface.

## Features

- 🔐 User Authentication (Register/Login)
- 🌐 Webhook Creation and Management
- 📊 Webhook Logs and Monitoring
- 🔄 Real-time Updates
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure API Key Management

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/webhook-nest.git
cd webhook-nest
```

2. Set up the backend:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5001
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=webhook_nest
JWT_SECRET=your_jwt_secret_key
```

4. Set up the frontend:
```bash
cd ../frontend
npm install
```

5. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5001
```

## Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE webhook_nest;
```

2. The application will automatically create the necessary tables when you start the server.

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Webhooks
- `GET /api/webhooks` - Get all webhooks
- `POST /api/webhooks/create` - Create a new webhook
- `GET /api/webhooks/:slug/logs` - Get webhook logs

### Webhook Receiver
- `POST /api/receive/:slug` - Send webhook payload

## Project Structure

```
webhook-nest/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── App.tsx
    ├── .env
    ├── package.json
    └── vite.config.ts
```

## Technologies Used

### Backend
- Node.js
- Express.js
- Sequelize (MySQL ORM)
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Query
- React Router

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Tailwind CSS](https://tailwindcss.com/) #   w e b h o o k - n e s t  
 