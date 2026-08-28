# Student Hub - Project Brain (Architecture & Logic)

## Overview
Student Hub is an all-in-one platform for modern students featuring organized study notes, coding practice tracks, AI-powered assistance, and real-time collaboration tools. It separates access into Student and Administrator roles.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion for animations, React Router for navigation, Socket.io Client for real-time features.
- **Backend**: Node.js, Express.js, MongoDB (with Mongoose), Socket.io, JWT for authentication.

## Architecture

### Client-Side (React Application)
- **Routing (`client/src/App.jsx`)**: The application uses React Router with lazy loading for route components to optimize bundle size. It includes protected routes that verify user authentication.
- **State Management**: Redux is used alongside React Context (`DataContext`, `SocketContext`, `ThemeContext`) for managing global application state, real-time connections, and UI themes.
- **UI Components**: Built with functional React components, utilizing Tailwind CSS for styling and Framer Motion for smooth, interactive micro-animations.

### Server-Side (Node.js & Express)
- **REST APIs**: The server provides standard RESTful endpoints for Authentication (`/api/auth`), Content Management (`/api/content`), User Management (`/api/users`), Community interaction (`/api/community/posts`), and Notifications.
- **Database schema**: Relies on MongoDB schemas defined via Mongoose (e.g., Users, Content, Posts, Comments, Notifications).
- **Authentication**: Secured with JSON Web Tokens (JWT). Passwords are encrypted using bcryptjs before being saved to the database.

## Core Logic & Data Flow
1. **Authentication Flow**: A user signs up/logs in, receives a JWT from the server, and the client stores this (likely in localStorage or cookies) to authorize protected API calls and route access.
2. **Real-time Communication**: Socket.io establishes a persistent connection upon login. This is used for live chat, real-time notifications, and online presence tracking.
3. **Role-Based Access Control**:
   - `student` users have access to the Dashboard, Study Materials, AI Assistant, and Community.
   - `admin` users have access to an Admin Panel to manage users, upload study materials, view analytics, and broadcast notifications.
