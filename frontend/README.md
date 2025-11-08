# UniVoice - Student Frontend

Modern, dark-themed student portal for the UniVoice Digital Complaint Management System.

## 🎨 Features

- **Modern Dark Theme** - Beautiful gradient backgrounds and smooth animations
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Authentication** - Secure student login and registration
- **Complaint Submission** - Multi-step forms for 4 categories:
  - Academic Issues
  - Sports & Facilities  
  - Exam Related
  - Harassment Reports
- **Real-time Tracking** - Track complaints using 6-digit tokens
- **Anonymous Submissions** - Option to submit complaints anonymously
- **Protected Routes** - Authenticated access to dashboard and forms

## 🚀 Tech Stack

- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server

## 📁 Project Structure

```
src/
├── components/
│   └── ProtectedRoute.jsx    # Route protection wrapper
├── context/
│   └── AuthContext.jsx        # Authentication state management
├── pages/
│   ├── Landing.jsx            # Landing page
│   ├── Login.jsx              # Student login
│   ├── Register.jsx           # Student registration
│   ├── Dashboard.jsx          # Student dashboard
│   ├── SubmitComplaint.jsx    # Multi-step complaint form
│   └── TrackComplaint.jsx     # Complaint tracking
├── utils/
│   └── api.js                 # API utilities
├── App.jsx                    # Main app with routing
├── main.jsx                   # App entry point
└── index.css                  # Global styles
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

The frontend connects to the backend API at `http://localhost:5000/api`.

Make sure the backend server is running before starting the frontend.

### API Endpoints Used:

- `POST /api/students/register` - Student registration
- `POST /api/students/login` - Student login
- `POST /api/complaints` - Submit complaint
- `GET /api/complaints/track/:token` - Track complaint by token

## 📱 Pages & Routes

### Public Routes
- `/` - Landing page
- `/login` - Student login
- `/register` - Student registration  
- `/track` - Track complaint (no login required)

### Protected Routes (Require Login)
- `/dashboard` - Student dashboard
- `/submit/academic` - Submit academic complaint
- `/submit/sports` - Submit sports complaint
- `/submit/exam` - Submit exam complaint
- `/submit/harassment` - Submit harassment complaint

## 🎯 Key Features Explained

### 1. Multi-Step Complaint Form

The complaint submission process has 3 steps:
1. **Select Type** - Choose specific issue type
2. **Describe Issue** - Detailed description
3. **Your Details** - Student information (with anonymous option)

### 2. Anonymous Submissions

Students can toggle anonymous mode which:
- Hides their personal information
- Still allows tracking via token
- Automatically applied for harassment complaints

### 3. Real-time Tracking

Students receive a 6-digit token after submission:
- Track complaint status (received → assigned → in_progress → resolved)
- View admin updates and messages
- See timeline and progress

### 4. Authentication

Secure JWT-based authentication:
- Login credentials stored in localStorage
- Protected routes redirect to login
- Auto-login on page refresh
- Logout clears session

## 🎨 Dark Theme Colors

- **Background**: Slate-900 to Slate-800 gradients
- **Cards**: Slate-800/50 with backdrop blur
- **Borders**: Slate-700 with hover effects
- **Primary**: Blue-500 to Cyan-500 gradient
- **Success**: Green-500 to Emerald-500
- **Warning**: Yellow-400 to Orange-500
- **Danger**: Red-500 to Orange-500

## 🔧 Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `vite.config.js` - Vite build configuration
- `eslint.config.js` - ESLint rules

## 📝 Environment Variables

No environment variables needed for development. The API URL is hardcoded to `http://localhost:5000/api`.

For production, update the `API_BASE_URL` in `src/utils/api.js`.

## 🚦 Development Workflow

1. Start backend server: `npm run dev` (in backend folder)
2. Start frontend server: `npm run dev` (in frontend folder)
3. Open browser to `http://localhost:5173`
4. Register a new student account
5. Login and submit complaints
6. Track complaints using tokens

## 🎭 Testing

### Test Student Account
You can register any student account or use:
- Email: student@university.edu
- Password: password123

### Test Complaint Flow
1. Login to dashboard
2. Click on a complaint category
3. Fill multi-step form
4. Submit and receive token
5. Track using the token number

## 🐛 Common Issues

**Issue**: Backend connection error
- **Fix**: Ensure backend is running on port 5000

**Issue**: CORS errors
- **Fix**: Backend has CORS enabled for all origins

**Issue**: 404 on refresh
- **Fix**: Using React Router with BrowserRouter

**Issue**: Styles not loading
- **Fix**: Ensure Tailwind is installed: `npm install -D tailwindcss`

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
- react: ^19.1.1
- react-dom: ^19.1.1
- react-router-dom: ^7.8.1
- framer-motion: Latest
- lucide-react: Latest

### Development
- vite: ^7.1.7
- tailwindcss: Latest
- postcss: Latest
- autoprefixer: Latest
- eslint: ^9.36.0

## 🎉 Features Showcase

✅ Beautiful landing page with feature highlights
✅ Smooth page transitions with Framer Motion
✅ Form validation and error handling
✅ Success animations after submission
✅ Token display with copy functionality
✅ Responsive navigation and mobile menu
✅ Loading states and spinners
✅ Gradient backgrounds and glassmorphism
✅ Custom scrollbar styling
✅ Hover effects and micro-interactions

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

**Built with ❤️ for UniVoice Digital Complaint System**
