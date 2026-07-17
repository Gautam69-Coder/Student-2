# Student Hub

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.0+-green.svg)](https://www.mongodb.com/)

A modern student portal that brings practicals, PYQs, notes, AI assistance, community collaboration, and real-time tools into one workspace.

## 🌟 What’s Included

- **Organized Study Materials**: Notes, practicals, and previous year questions
- **AI Assistant**: Help with coding, academics, and concept explanation
- **Community Hub**: Create posts, comment, and engage with peers
- **Real-time Chat & Notifications**: Live communication and alerts
- **Dashboard & Progress Tracking**: Monitor learning activity and engagement
- **Admin Controls**: Manage users, content, analytics, and announcements

## 🧩 Project Structure

- `client/` — React frontend built with Vite
- `server/` — Node + Express backend API
- `uploads/` — file uploads and user-generated assets
- `README.md` — project documentation

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Socket.io Client
- Axios

### Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- Socket.io
- JWT authentication
- bcryptjs
- Nodemailer

## 🚀 Setup

### Prerequisites
- Node.js 18+
- npm
- MongoDB (local or cloud)

### Install Dependencies

```bash
cd server
npm install
cd ../client
npm install
```

### Configure Environment Variables

Copy the example file in the server folder and update values:

```bash
cd server
copy .env.example .env
```

Then update `server/.env` with your values.

### Run Locally

```bash
cd server
npm run dev
```

```bash
cd ../client
npm run dev
```

- Server default: `http://localhost:5001`
- Client default: `http://localhost:5173`

## 🔧 Available Scripts

### Client
- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

### Server
- `npm start` — start the API server
- `npm run dev` — start with nodemon for live reload

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Content
- `GET /api/content`
- `POST /api/content`
- `PUT /api/content/:id`
- `DELETE /api/content/:id`

### User Management
- `GET /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Community
- `GET /api/community/posts`
- `POST /api/community/posts`
- `POST /api/community/posts/:id/comments`

### Notifications
- `GET /api/notifications`
- `POST /api/notifications`

## 📖 Usage

### Student Flow
1. Register or log in
2. Access notes, practicals, and PYQs
3. Use the AI assistant for learning support
4. Join community discussions
5. Track progress and receive notifications

### Admin Flow
1. Manage users and permissions
2. Upload and organize content
3. Monitor analytics and activity
4. Send announcements

## 🔒 Environment Variables

Create `server/.env` with:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/studenthub
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:5173
```

## 🐳 Docker (Optional)

```bash
docker build -t student-hub ./server
docker run -p 5001:5001 -e MONGODB_URI=your_mongodb_uri student-hub
```

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/YourFeature`
3. Commit your changes
4. Push and open a Pull Request

## 📄 License

ISC

## 👥 Support

Use the repository issue tracker or contact the project maintainers for support.
- UI Components inspired by modern design systems
- Special thanks to all contributors

---

**Made with ❤️ for students, by students**</content>
<parameter name="filePath">d:\PC Data\Student-2\README.md