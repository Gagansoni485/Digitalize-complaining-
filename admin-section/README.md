# UniVoice Admin Dashboard

Admin dashboard for the UniVoice Digital Complaint Management System.

## 🎨 Features

- **Modern Dashboard** - Clean interface with real-time complaint statistics
- **Complaint Management** - View, assign, and update complaints
- **User Management** - Manage student and admin accounts
- **Category Management** - Configure complaint categories
- **Profile Settings** - Update admin profile and credentials
- **Authentication** - Secure admin login with role-based access
- **Responsive Design** - Works on desktop and tablet devices

## 🚀 Tech Stack

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Fast build tool and dev server

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.jsx         # Main layout with sidebar and topbar
│   ├── Sidebar.jsx        # Navigation sidebar
│   └── Topbar.jsx         # Top navigation bar
├── context/
│   └── AuthContext.jsx    # Authentication state management
├── pages/
│   ├── Login.jsx          # Admin login
│   ├── AdminDashboard.jsx # Main dashboard for regular admins
│   ├── SuperAdminDashboard.jsx # Extended dashboard for super admins
│   ├── ComplaintsList.jsx  # List all complaints
│   ├── ComplaintDetails.jsx # View complaint details
│   ├── Categories.jsx      # Manage complaint categories
│   ├── ManageAdmins.jsx   # Super admin: manage admin accounts
│   └── Profile.jsx        # Admin profile settings
├── utils/
│   └── api.js             # API utilities
├── App.jsx                # Main app with routing
├── main.jsx               # App entry point
└── index.css              # Global styles
```

## 🛠️ Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

4. **Preview production build:**
```bash
npm run preview
```

## 🔗 Backend Connection

The admin dashboard connects to the backend API at `http://localhost:5000/api`.

Make sure the backend server is running before starting the admin dashboard.

### API Endpoints Used:

- `POST /api/admins/login` - Admin login
- `GET /api/admins/profile` - Get admin profile
- `PUT /api/admins/profile` - Update admin profile
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id` - Update complaint status
- `GET /api/students` - Get all students (super admin)
- `POST /api/categories` - Create category (super admin)
- `GET /api/categories` - Get all categories
- `PUT /api/categories/:id` - Update category (super admin)
- `DELETE /api/categories/:id` - Delete category (super admin)

## 📱 Pages & Routes

### Public Routes
- `/admin/login` - Admin login

### Admin Routes (Require Login)
- `/admin/dashboard` - Admin dashboard
- `/admin/complaints` - List all complaints
- `/admin/complaints/:id` - View complaint details
- `/admin/categories` - Manage categories (super admin)
- `/admin/manage-admins` - Manage admins (super admin)
- `/admin/profile` - Admin profile settings

## 🎯 Key Features Explained

### 1. Role-Based Access

Two admin roles:
- **Regular Admin**: Can view and manage complaints, update profile
- **Super Admin**: All regular admin features plus user management and category configuration

### 2. Complaint Management

Admins can:
- View all complaints in a table with filtering options
- Click on complaints to see detailed information
- Update complaint status (received → assigned → in_progress → resolved)
- Add notes and messages to complaints
- Assign complaints to specific categories

### 3. Dashboard Statistics

Real-time statistics display:
- Total complaints by status
- Complaints by category
- Recent complaints
- System activity timeline

### 4. Authentication

Secure JWT-based authentication:
- Login credentials stored in localStorage
- Protected routes redirect to login
- Auto-login on page refresh
- Logout clears session

## 🎨 Admin Dashboard Colors

- **Background**: White with light gray accents
- **Cards**: White with subtle shadows
- **Primary**: Blue-600 for actions and highlights
- **Success**: Green-500 for resolved complaints
- **Warning**: Yellow-500 for in-progress complaints
- **Danger**: Red-500 for new complaints
- **Info**: Blue-500 for assigned complaints

## 🔧 Configuration Files

- `vite.config.js` - Vite build configuration with base path set to './'
- `eslint.config.js` - ESLint rules

## 📝 Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:5000/api)

## 🚦 Development Workflow

1. Start backend server: `npm run dev` (in backend folder)
2. Start admin dashboard: `npm run dev` (in admin-section folder)
3. Open browser to `http://localhost:5174/admin/login`
4. Login with admin credentials
5. Manage complaints and system settings

## 🐛 Common Issues

**Issue**: Backend connection error
- **Fix**: Ensure backend is running on port 5000

**Issue**: CORS errors
- **Fix**: Backend has CORS enabled for all origins

**Issue**: 404 on refresh
- **Fix**: Using React Router with BrowserRouter

## 🚀 Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the build command to:
   ```
   npm install && npm run build
   ```
4. Set the publish directory to:
   ```
   dist
   ```
5. Add environment variables if needed:
   - `VITE_API_BASE_URL` - Your backend API URL

### Fixing 404 Errors

If you encounter `net::ERR_ABORTED 404 (Not Found)` errors:

1. Ensure `base: './'` is set in `vite.config.js`
2. Clear Render's build cache:
   - Go to your Render dashboard
   - Select your web service
   - Click "Manual Deploy" → "Clear build cache & deploy"
3. Redeploy the application to ensure the latest build is published

## 📦 Dependencies

### Production
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.22.3

### Development
- vite: ^7.1.7
- @vitejs/plugin-react: ^5.0.4
- eslint: ^9.36.0

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

**Built with ❤️ for UniVoice Digital Complaint System**