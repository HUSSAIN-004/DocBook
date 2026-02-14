# DocBook - Doctor Appointment Booking System

A full-stack MERN application for booking doctor appointments with User, Doctor, and Admin roles.

## Tech Stack

### Frontend
- React (Vite)
- React Router v6
- Redux Toolkit
- Bootstrap 5
- React Toastify
- Fetch API (with credentials: include)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication (HTTP-only cookies)
- Multer (file uploads)
- bcrypt (password hashing)

## Features

### User Features
- Register/Login with profile image
- View approved doctors
- Search doctors by speciality
- View doctor details
- Book appointments
- View own appointments
- Cancel appointments
- Apply to become a doctor

### Doctor Features
- Doctor dashboard
- View appointments
- Approve/Complete appointments
- Update doctor profile

### Admin Features
- Admin dashboard with stats
- Manage all users
- Delete users (except admins)
- Manage all doctors
- Approve/Block/Unblock doctors

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository

2. Setup Backend:
```bash
cd server
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your credentials:
# - MONGODB_URI
# - JWT_SECRET
```

3. Setup Frontend:
```bash
cd client
npm install
```

4. Create Admin User:
```bash
cd server
node scripts/seed.js
```

Admin credentials:
- Email: admin@docbook.com
- Password: admin123

### Running the Application

**Terminal 1 - Backend (port 5000):**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend (port 5173):**
```bash
cd client
npm run dev
```

Open http://localhost:5173 in your browser.

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/doctor-appointment
JWT_SECRET=your_super_secret_jwt_key_change_this
FRONTEND_URL=http://localhost:5173
```

## API Endpoints

### Auth Routes (`/api/auth`)
- POST `/register` - Register user
- POST `/login` - Login user
- POST `/logout` - Logout user
- GET `/me` - Get current user

### User Routes (`/api/users`)
- GET `/profile` - Get user profile
- PUT `/profile` - Update user profile

### Doctor Routes (`/api/doctors`)
- GET `/` - Get all approved doctors
- GET `/speciality/:speciality` - Get doctors by speciality
- GET `/:id` - Get single doctor
- POST `/apply` - Apply to become doctor
- GET `/profile/me` - Get doctor's own profile
- PUT `/profile` - Update doctor profile
- GET `/application/status` - Check application status

### Appointment Routes (`/api/appointments`)
- POST `/book` - Book appointment
- GET `/my-appointments` - Get user's appointments
- GET `/doctor-appointments` - Get doctor's appointments
- PUT `/:id/status` - Update appointment status
- PUT `/:id/cancel` - Cancel appointment

### Admin Routes (`/api/admin`)
- GET `/users` - Get all users
- DELETE `/users/:id` - Delete user
- GET `/doctors` - Get all doctors
- PUT `/doctors/:id/approve` - Approve doctor
- PUT `/doctors/:id/block` - Block doctor
- PUT `/doctors/:id/unblock` - Unblock doctor
- GET `/stats` - Get dashboard stats

## Project Structure

```
├── server/
│   ├── middleware/
│   │   ├── authVerify.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── adminRoutes.js
│   ├── scripts/
│   │   └── seed.js
│   ├── index.js
│   ├── package.json
│   └── .env.example
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── doctor/
│   │   ├── redux/
│   │   │   └── slices/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Image Storage

Images are stored as base64 strings directly in MongoDB. This eliminates the need for external storage services like Cloudinary. The upload is limited to 2MB per image to keep database size manageable.

## Security Features

- HTTP-only cookie authentication (no localStorage)
- Password hashing with bcrypt
- JWT token verification
- Protected routes middleware
- Role-based access control
- CORS configuration
- Input validation

## License

MIT
