# Language Hub Backend API

A RESTful API backend for a language learning platform built with Node.js, Express, TypeScript, and MongoDB.

## 🌟 Features

- **User Authentication**: Registration, login, token refresh, and JWT-based authentication
- **Password Management**: Forgot password and password reset functionality with email notifications
- **AI-Powered Chat**: Integration with OpenRouter API for AI-assisted language learning conversations
- **Course Progress Tracking**: Save and retrieve user progress across different courses and lessons
- **Secure**: bcrypt password hashing, JWT tokens, and CORS configuration

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Email**: Nodemailer
- **AI Integration**: OpenRouter API via Axios
- **Development**: ts-node-dev for hot reload

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 🔴 Check Frontend Repository
Make sure to also check out the frontend repository for this project: [Language Hub Frontend](https://github.com/hasinduudara/RAD_Final_Project_Frontend.git)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hasinduudara/RAD_Final_Project_Backend.git
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secrets
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# OpenRouter API (for AI chat)
OPENROUTER_API_KEY=your_openrouter_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Development

Run the development server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the PORT specified in your .env file).

### Production

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── chatController.ts
│   │   ├── course.controller.ts
│   │   ├── password.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/         # Custom middleware
│   │   └── user.ts        # Authentication middleware
│   ├── models/            # MongoDB schemas
│   │   ├── Chat.model.ts
│   │   ├── CourseProgress.model.ts
│   │   ├── resetToken.model.ts
│   │   └── user.model.ts
│   ├── routes/            # API routes
│   │   ├── chatRoutes.ts
│   │   ├── courseRoutes.ts
│   │   ├── password.routes.ts
│   │   └── user.ts
│   ├── utils/             # Utility functions
│   │   ├── mail.ts
│   │   ├── openrouterClient.ts
│   │   └── tokens.ts
│   └── index.ts           # Application entry point
├── package.json
├── tsconfig.json
└── .env
```

## 🔌 API Endpoints

### User Routes (`/api/v1/user`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /refresh` - Refresh access token
- `GET /welcome` - Protected route example

### Password Routes (`/api/password`)
- `POST /forgot` - Request password reset email
- `POST /reset` - Reset password with token

### Chat Routes (`/api/chat`)
- `POST /` - Create new chat session
- `POST /message` - Send message to AI
- `GET /:chatId` - Get chat history
- `GET /user/:userId` - Get all user chats
- `DELETE /:chatId` - Delete chat

### Course Routes (`/api/course`, `/api/v1/course`)
- `POST /save-progress` - Save user course progress
- `GET /progress/:userId/:course` - Get user progress for a course

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 🌐 CORS Configuration

CORS is configured to accept requests from:
- `http://localhost:5173` (default Vite frontend)

Update the CORS origin in `src/index.ts` to match your frontend URL.

## 📦 Dependencies

### Main Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `nodemailer` - Email sending
- `axios` - HTTP client for OpenRouter API
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Dev Dependencies
- `typescript` - TypeScript compiler
- `ts-node-dev` - Development server with hot reload
- `@types/*` - TypeScript type definitions

## 🐛 Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 📝 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ for language learners worldwide

