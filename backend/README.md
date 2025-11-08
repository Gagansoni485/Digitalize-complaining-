# UniVoice Backend API

RESTful API server for the UniVoice Digital Complaint Management System.

## 🎯 Features

- **Student Management** - Registration, authentication, and profile management
- **Complaint Management** - Create, track, and manage complaints
- **Admin Management** - Admin authentication and role-based access control
- **Category Management** - Complaint category configuration
- **JWT Authentication** - Secure token-based authentication
- **MongoDB Integration** - Database operations with Mongoose ODM

## 🚀 Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JSON Web Tokens** - Authentication
- **BCrypt.js** - Password hashing

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── studentController.js # Student-related logic
│   ├── adminController.js   # Admin-related logic
│   └── complaintController.js # Complaint-related logic
├── models/
│   ├── Student.js          # Student schema
│   ├── Admin.js            # Admin schema
│   └── Complaint.js        # Complaint schema
├── routes/
│   ├── studentRoutes.js    # Student API routes
│   ├── adminRoutes.js      # Admin API routes
│   └── complaintRoutes.js  # Complaint API routes
├── services/
│   └── complaintDistribution.js # Complaint assignment logic
├── middleware/
│   └── authMiddleware.js   # Authentication middleware
├── utils/
│   └── jwtUtils.js         # JWT utility functions
├── index.mjs               # Entry point
└── .env                    # Environment variables
```

## 🛠️ Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env` file with the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/univoice
JWT_SECRET=your_jwt_secret_here
```

3. **Start development server:**
```bash
npm run dev
```

## 🔌 API Endpoints

### Student Routes (`/api/students`)
- `POST /register` - Register new student
- `POST /login` - Student login
- `GET /profile` - Get student profile (authenticated)
- `PUT /profile` - Update student profile (authenticated)

### Admin Routes (`/api/admin`)
- `POST /login` - Admin login
- `GET /profile` - Get admin profile (authenticated)
- `PUT /profile` - Update admin profile (authenticated)
- `GET /admins` - Get all admins (super admin only)
- `POST /admins` - Create new admin (super admin only)
- `DELETE /admins/:id` - Delete admin (super admin only)

### Complaint Routes (`/api/complaints`)
- `POST /` - Submit new complaint
- `GET /track/:token` - Track complaint by token
- `GET /student` - Get complaints for logged-in student
- `GET /` - Get all complaints (admin)
- `GET /:id` - Get specific complaint (admin)
- `PUT /:id` - Update complaint status (admin)
- `GET /categories` - Get all complaint categories
- `POST /categories` - Create new category (super admin only)
- `PUT /categories/:id` - Update category (super admin only)
- `DELETE /categories/:id` - Delete category (super admin only)

## 🔐 Authentication

### Student Authentication
1. Students register with email and password
2. Password is hashed using BCrypt
3. Login returns JWT token
4. Token must be included in Authorization header for protected routes

### Admin Authentication
1. Admins login with email and password
2. Password is hashed using BCrypt
3. Login returns JWT token with admin role
4. Token must be included in Authorization header for protected routes
5. Some routes require super admin role

## 🗄️ Database Models

### Student
- `name` - Student full name
- `email` - Unique email address
- `password` - Hashed password
- `matricNumber` - Unique matriculation number
- `department` - Department name
- `level` - Academic level/year

### Admin
- `name` - Admin full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - Role (admin or super_admin)

### Complaint
- `token` - Unique 6-digit tracking token
- `category` - Complaint category
- `title` - Complaint title
- `description` - Detailed description
- `student` - Reference to Student model
- `anonymous` - Boolean for anonymous submission
- `status` - Current status (received, assigned, in_progress, resolved)
- `assignedTo` - Reference to Admin model
- `updates` - Array of status updates with timestamps
- `priority` - Priority level (low, medium, high)

## 🚀 Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command to:
   ```
   npm install
   ```
4. Set the start command to:
   ```
   npm start
   ```
5. Add environment variables:
   - `NODE_ENV` - production
   - `PORT` - 5000 (or Render's provided port)
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key

### Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing

## 🐛 Common Issues

**Issue**: Database connection error
- **Fix**: Ensure MongoDB is running and MONGO_URI is correct

**Issue**: JWT token invalid
- **Fix**: Check that JWT_SECRET is set and consistent

**Issue**: CORS errors
- **Fix**: CORS is enabled for all origins in development

## 📦 Dependencies

### Production
- express: ^5.1.0
- mongoose: ^8.17.1
- bcryptjs: ^3.0.2
- jsonwebtoken: ^9.0.2
- cors: ^2.8.5
- dotenv: ^17.2.1

### Development
- eslint: ^9.33.0

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

**Built with ❤️ for UniVoice Digital Complaint System**