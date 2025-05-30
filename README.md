# Mess Management System - Jubilee Hall

![Dashboard Preview](https://i.ibb.co/ycS6vHZr/screencapture-jubileehallmess-vercel-app-login-2025-05-30-18-26-33.png)

A comprehensive hostel mess management system designed for Jubilee Hall to streamline meal bookings, menu planning, and administrative tasks.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### 👤 User Features
- **Resident Registration** with role-based access
- **Meal Booking System** for breakfast, lunch, and dinner
- **Guest Meal Booking** with QR code confirmation
- **Rebate Management** for leave applications
- **Booking History** with filter options
- **Real-time Menu View** with daily updates

### 👨‍💼 Admin Features
- **Menu Management** with weekly planning
- **Off-day Declaration** with reason tracking
- **Order Summaries** with item-wise breakdown
- **Booking Analytics** with graphical reports
- **User Management** for resident administration
- **Discount Management** for early bookings

## Technologies

### Frontend
- React 18
- Redux for state management
- Tailwind CSS for styling
- Axios for API communication
- Chart.js for data visualization

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Netlify Functions for serverless API
- Bcrypt for password hashing

### DevOps
- Netlify for frontend hosting
- MongoDB Atlas for cloud database
- GitHub Actions for CI/CD
- Postman for API testing

## Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- npm v9+

### Steps
1. Clone the repository:
```bash
git clone https://github.com/yourusername/mess-management-system.git
cd mess-management-system
```

2. Install dependencies for both frontend and backend:
```bash
cd frontend
npm install
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# backend/.env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
```

4. Start development servers:
```bash
# Frontend
cd frontend
npm start

# Backend
cd backend
npm run dev
```

## Configuration

### Admin Setup
1. Create your first admin user by running:
```bash
cd backend
node utils/createAdmin.js
```

2. Configure weekly menu template:
```json
// seeds/menuTemplate.json
{
  "monday": {
    "breakfast": ["Item1", "Item2"],
    "lunch": ["Item3", "Item4"],
    "dinner": ["Item5", "Item6"]
  },
  // ... other days
}
```

### Email Setup
For password reset functionality:
```env
EMAIL_SERVICE=Gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=no-reply@mess-management.com
```

## Usage Guide

### Resident Flow
1. **Login** to your resident account
2. View today's **menu**
3. **Book meals** for upcoming days
4. Apply for **rebates** when going on leave
5. Invite **guests** with meal booking
6. View **booking history**

### Admin Flow
1. **Manage weekly menu**
2. Declare **mess off-days**
3. View **booking analytics**
4. Approve/Reject **rebate applications**
5. Generate **daily order summaries**
6. Manage **resident accounts**

## Screenshots

### User Dashboard
![User Dashboard](https://i.ibb.co/zTWCy2c8/screencapture-jubileehallmess-vercel-app-dashboard-2025-05-30-19-12-17.png)

### Admin Analytics
![Admin Analytics](https://i.ibb.co/hx6hXScD/screencapture-jubileehallmess-vercel-app-admin-2025-05-30-19-18-10.png)

### Bookings
![Menu Management](https://i.ibb.co/hx6hXScD/screencapture-jubileehallmess-vercel-app-admin-2025-05-30-19-18-10.png)

## Deployment

### Frontend (Netlify)
1. Push code to GitHub repository
2. Connect to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variables:
   - `REACT_APP_API_BASE_URL` = your backend URL

### Backend (Netlify Functions)
1. Configure `netlify.toml`:
```toml
[build]
  command = "npm run build"
  functions = "netlify/functions-build"
  publish = "public"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. Add MongoDB connection string to Netlify environment variables

### Database (MongoDB Atlas)
1. Create free cluster on MongoDB Atlas
2. Whitelist all IP addresses (0.0.0.0/0)
3. Create user with read/write privileges
4. Get connection string and add to environment variables

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

### Code Standards
- Follow React best practices
- Use descriptive component names
- Maintain consistent formatting with Prettier
- Write meaningful commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed with ❤️ for Jubilee Hall**  
[Contact Support](mailto:support@mess-management.com) | 
[Report Issue](https://github.com/yourusername/mess-management-system/issues)
