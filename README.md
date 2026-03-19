# Student Hub

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.0+-green.svg)](https://www.mongodb.com/)

An all-in-one platform for modern students featuring organized practicals, previous year questions (PYQs), AI-powered assistance, and real-time collaboration tools.

## 🌟 Features

### For Students
- **📚 Study Materials**: Access organized notes, practicals, and PYQs
- **🤖 AI Assistant**: Get instant help with coding and academic queries
- **👥 Community**: Connect with fellow students and share knowledge
- **📊 Dashboard**: Track your progress and study statistics
- **🔔 Notifications**: Stay updated with important announcements
- **💬 Real-time Chat**: Collaborate with peers in real-time
- **📱 Responsive Design**: Seamless experience across all devices

### For Administrators
- **👥 User Management**: Manage student accounts and permissions
- **📝 Content Management**: Upload and organize study materials
- **📊 Analytics Dashboard**: Monitor platform usage and engagement
- **📢 Notification System**: Send announcements to all users
- **📈 Activity Tracking**: Monitor student activity and progress
- **💬 Message Broadcasting**: Send targeted messages to users

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **React Router** - Declarative routing for React
- **Socket.io Client** - Real-time bidirectional communication
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Socket.io** - Real-time communication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email sending functionality

## 🚀 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-2
   ```

2. **Environment Setup**
   ```bash
   # Create environment file for server
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install Dependencies**

   **Server:**
   ```bash
   cd server
   npm install
   ```

   **Client:**
   ```bash
   cd ../client
   npm install
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - Update connection string in `server/.env`

5. **Start Development Servers**

   **Terminal 1 - Server:**
   ```bash
   cd server
   npm start
   # Server will run on http://localhost:5001
   ```

   **Terminal 2 - Client:**
   ```bash
   cd client
   npm run dev
   # Client will run on http://localhost:5173
   ```

## 📖 Usage

### Student Features
1. **Registration/Login**: Create account or sign in
2. **Dashboard**: View personalized study dashboard
3. **Study Materials**: Access notes, practicals, and PYQs
4. **AI Assistant**: Get help with coding and academic questions
5. **Community**: Participate in discussions and share knowledge
6. **Profile**: Manage personal information and preferences

### Admin Features
1. **Admin Panel**: Access administrative dashboard
2. **User Management**: View and manage user accounts
3. **Content Upload**: Add study materials and resources
4. **Analytics**: Monitor platform statistics
5. **Notifications**: Send announcements to users

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Content Management
- `GET /api/content` - Get all content
- `POST /api/content` - Upload new content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### User Management (Admin)
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user details
- `DELETE /api/users/:id` - Delete user

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create new post
- `POST /api/community/posts/:id/comments` - Add comment

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Send notification

## 🐳 Docker Deployment

### Build and Run with Docker
```bash
# Build the Docker image
docker build -t student-hub ./server

# Run the container
docker run -p 5001:5001 -e MONGODB_URI=your_mongodb_uri student-hub
```

## 🔒 Environment Variables

Create a `.env` file in the server directory with:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/studenthub
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:5173
```

## 📱 Real-time Features

- **Live Notifications**: Instant notification delivery
- **Online Presence**: See who's online in real-time
- **Activity Tracking**: Monitor user engagement
- **Live Chat**: Real-time messaging system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email support@studenthub.com or join our Discord community.

## 🙏 Acknowledgments

- Icons by [Lucide React](https://lucide.dev/)
- UI Components inspired by modern design systems
- Special thanks to all contributors

---

**Made with ❤️ for students, by students**</content>
<parameter name="filePath">d:\PC Data\Student-2\README.md