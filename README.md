# Sara7a – Anonymous Messaging Platform

Sara7a is a modern, secure, and high-performance anonymous messaging application.
Users can send and receive messages anonymously, manage their profiles, and verify accounts safely using email-based OTP.

Built with focus on **performance**, **security**, and **clean architecture**.

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?logo=redis&logoColor=white)](https://redis.io)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Anonymous Messaging** | Send & receive messages without revealing identity |
| **Email OTP Verification** | Secure signup & account activation |
| **Event-Driven Email Delivery** | Async sending using Nodemailer + custom events |
| **Redis OTP Caching** | Fast access & reduced database pressure |
| **JWT Authentication + JTI** | Stateless auth with effective token revocation |
| **Session & Token Blacklisting** | Stored in Redis for instant invalidation |
| **Profile Customization** | Update name, avatar, bio, and sharing preferences |
| **File Uploads** | Secure image/file attachments in messages |
| **Rate Limiting & RBAC** | Login protection, input sanitization, role-based access |
| **Input Validation** | Joi + custom regex patterns |

> **Performance gain:** ~70% faster email delivery after migrating to event-driven architecture + Redis OTP caching.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Caching | Redis |
| Authentication | JWT (with JTI), bcrypt |
| Email | Nodemailer (SMTP + app passwords) |
| File Upload | Multer |
| Validation | Joi |
| Environment | dotenv |
| Development | nodemon |

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/hazzem-web/Sara7a_App.git
cd Sara7a_App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
# ── Required ──────────────────────────────────
PORT=3000
MONGO_URI=mongodb://localhost:27017/sara7a
REDIS_URL=redis://localhost:6379

JWT_SECRET=your-very-long-random-secret-here

# Email configuration (Gmail example)
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=your-app-specific-password

# ── Optional ───────────────────────────────────
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Start the server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

---

## 📂 Project Structure

```
src/
├── auth/           # Login, signup, token logic, revocation
├── user/           # Profile CRUD, settings
├── messages/       # Anonymous messages + attachments
├── uploads/        # Multer config + file handling
├── email/          # Email & notification event emitters
├── middleware/     # Auth, rate-limit, validation, error handling
├── config/         # DB, Redis, env parsing
├── utils/          # Validators, helpers, constants
├── app.controller/ # All Project Setup
└── app.js          # Main Express application
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

Please follow [conventional commits](https://www.conventionalcommits.org/) and keep code style consistent.

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by <a href="https://github.com/hazzem-web">Hazzem</a></p>
