# Sara7a – Anonymous Messaging Platform

Sara7a is a modern, secure, and high-performance anonymous messaging application.  
Users can send and receive messages anonymously, manage their profiles, and verify accounts safely using email-based OTP and Two-Step Verification (2FA).

Built with focus on **performance**, **security**, and **clean architecture**.

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![JWT](https://img.shields.io/badge/JWT-Auth-black?logo=jsonwebtokens&logoColor=white)](https://jwt.io)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Anonymous Messaging** | Send & receive messages without revealing identity |
| **Email OTP Verification** | Secure signup & account activation |
| **Two-Step Verification (2FA)** | OTP-based 2FA with Redis TTL and email confirmation |
| **Event-Driven Email Delivery** | Async sending using Nodemailer + custom events |
| **Redis OTP Caching** | Fast access & reduced database pressure |
| **JWT Authentication + JTI** | Stateless auth with effective token revocation |
| **Session & Token Blacklisting** | Stored in Redis for instant invalidation |
| **Brute-Force Protection** | Redis-based attempt limiting + temporary ban |
| **IP-Based Geo Restriction** | Country-level access control using geoip-lite |
| **Profile Customization** | Update name, avatar, bio, and sharing preferences |
| **File Uploads** | Secure image/file attachments via Multer |
| **Rate Limiting & RBAC** | Global + per-route protection with role-based access control |
| **Input Validation** | Joi + custom regex patterns |
| **Scheduled Cleanup** | Auto-deletion of unverified accounts via node-cron |

---

## ⚡ Performance Improvements

| Metric | Before | After |
|---|---|---|
| **Email Delivery** | Blocking (~1700ms) | Event-driven (~300–800ms) |
| **OTP Access** | DB queries | Redis TTL cache |
| **Repeated Queries** | Hit DB every time | Redis cache layer |

> Reduced response time from **~1700ms → ~300–800ms** by moving email sending to a background event-driven system and caching frequently accessed data in Redis.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Caching & Security | Redis (OTP cache, token blacklist, rate limiting) |
| Authentication | JWT (Access & Refresh Tokens + JTI), bcrypt |
| Email | Nodemailer (SMTP + app passwords) |
| File Upload | Multer |
| Validation | Joi + custom regex |
| Geo Restriction | geoip-lite |
| Scheduler | node-cron |
| Security Headers | helmet |
| Environment | dotenv |
| Development | nodemon |

---

## 🧠 2FA Flow (Two-Step Verification)

```
1. User toggles 2FA (Enable / Disable)
        ↓
2. System generates OTP
        ↓
3. OTP stored in Redis with TTL (5 minutes)
        ↓
4. OTP sent via email (event-driven, non-blocking)
        ↓
5. User submits OTP for verification
        ↓
6. System validates OTP from Redis
        ↓
7. Updates 2FA state in DB
        ↓
8. Sends confirmation email
```

---

## 📂 Project Structure

```
📦 Sara7a_App
├── 📁 config
│   ├── env.service.js
│   └── index.js
│
├── 📁 src
│   ├── 📁 common
│   │   ├── 📁 enums
│   │   │   └── enum.service.js
│   │   ├── 📁 hashing
│   │   │   └── hash.js
│   │   ├── 📁 middleware
│   │   │   ├── auth.js
│   │   │   ├── index.js
│   │   │   ├── multer.js
│   │   │   └── validation.js
│   │   ├── 📁 security
│   │   │   └── security.js
│   │   ├── 📁 utils
│   │   │   ├── 📁 email
│   │   │   │   ├── email.events.js
│   │   │   │   └── sendEmail.js
│   │   │   └── 📁 responses
│   │   │       ├── error.response.js
│   │   │       ├── index.js
│   │   │       └── success.response.js
│   │   └── index.js
│   │
│   ├── 📁 database
│   │   ├── 📁 models
│   │   │   ├── index.js
│   │   │   ├── message.model.js
│   │   │   └── user.model.js
│   │   ├── connection.js
│   │   ├── database.service.js
│   │   ├── index.js
│   │   ├── redis.js
│   │   └── redis.service.js
│   │
│   ├── 📁 modules
│   │   ├── 📁 auth              # Login, signup, token logic, revocation
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   ├── 📁 messages          # Anonymous messages + attachments
│   │   │   ├── message.controller.js
│   │   │   ├── message.service.js
│   │   │   └── message.validation.js
│   │   └── 📁 users             # Profile CRUD, settings
│   │       ├── user.controller.js
│   │       ├── user.service.js
│   │       └── user.validation.js
│   │
│   ├── app.controller.js
│   ├── cron.js
│   └── main.js
│
└── 📁 uploads
    └── 📁 image
        └── 📁 users
            ├── images/
            └── profileImages/
```

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



### 4. Start the server

```bash
# Development mode (with auto-restart)
npm run start:dev

# Production mode
npm start
```

---

## 📌 Key Highlights

- **Event-driven architecture** for async, non-blocking operations
- **Clean modular structure** separating concerns across `common`, `database`, and `modules`
- **Redis used for both caching and security** (OTP TTL, token blacklisting, brute-force protection)
- **Real-world authentication flows** (2FA + rate limiting + token revocation)
- **IP-based geo restriction** using geoip-lite to control access by country
- **Scheduled cron job** for automatic cleanup of unverified accounts
- **~70% performance gain** in email delivery after architectural migration

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