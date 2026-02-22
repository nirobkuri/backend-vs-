# News Portal Backend API

## Overview
A Node.js/Express backend API for a news portal application. Provides REST API endpoints for authentication, news management, user management, and contact forms.

## Tech Stack
- **Runtime**: Node.js 20
- **Framework**: Express 5
- **Database**: MongoDB (via Mongoose)
- **File Storage**: Cloudinary
- **Authentication**: JWT (jsonwebtoken + bcryptjs)

## Project Structure
```
server.js              - Main entry point, Express app setup
src/
  config/
    db.js              - MongoDB connection
    cloudinary.js      - Cloudinary + Multer storage config
  controllers/
    authController.js  - Login/register logic
    contactController.js - Contact form handling
    newsController.js  - News CRUD operations
    userController.js  - User management
  middleware/
    authMiddleware.js  - JWT auth middleware
    uploadMiddleware.js - File upload middleware
  models/
    Contact.js         - Contact model
    News.js            - News model
    User.js            - User model
  routes/
    authRoutes.js      - /api/auth routes
    contactRoutes.js   - /api/contact routes
    newsRoutes.js      - /api/news routes
    userRoutes.js      - /api/users routes
  utils/
    generateToken.js   - JWT token generation
```

## API Endpoints
- `GET /` - Health check
- `/api/auth` - Authentication (login/register)
- `/api/news` - News CRUD
- `/api/users` - User management
- `/api/contact` - Contact form

## Environment Variables (Required Secrets)
- `MONGO_URI` - MongoDB connection string
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Environment Variables (Auto-configured)
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRE` - JWT expiration (default: 7d)
- `NODE_ENV` - Environment mode
- `PORT` - Server port (default: 5000)

## Running
- Server binds to 0.0.0.0:5000
- MongoDB connection is optional; server starts without it but API routes requiring DB will fail
