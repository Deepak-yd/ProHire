# ProHire Application - Complete Feature Reference

Complete documentation of all features, API endpoints, test accounts, and usage examples.

---

## 🎯 Application Overview

**ProHire** is a full-stack professional freelance services platform with:
- User authentication and role-based access
- Professional profile management
- Job posting and hiring system
- Direct messaging
- Connection/friend request system
- Multiple skill categories
- Mobile-responsive UI

---

## 🔐 Test Accounts

### Admin Account
- **Email:** `admin@prohire.app`
- **Password:** `Admin@123`
- **Role:** Administrator
- **Access:** Full system access, user management

### Professional Account (Freelancer)
- **Email:** `ava@prohire.app`
- **Password:** `Pro@12345`
- **Role:** Professional/Service Provider
- **Access:** Can post jobs, view messages, manage hires

### Client Account
- **Email:** `ethan@prohire.app`
- **Password:** `User@12345`
- **Role:** Regular User/Client
- **Access:** Can send messages, hire professionals, request connections

---

## 📊 Sample Data

### Users (7 total)
1. Admin (admin@prohire.app)
2. Ava - Professional (ava@prohire.app)
3. Ethan - Client (ethan@prohire.app)
4. Mai - Professional (mai@prohire.app)
5. Sarah - Client (sarah@prohire.app)
6. Lucas - Professional (lucas@prohire.app)
7. Olivia - Client (olivia@prohire.app)

### Skills (25+ categories)
- Web Development
- UI/UX Design
- Mobile Development
- Data Science
- Cloud Engineering
- DevOps
- Machine Learning
- API Design
- Database Design
- Frontend Development
- Backend Development
- Full Stack Development
- Python Programming
- JavaScript Development
- React.js
- Vue.js
- Angular
- Node.js
- Express.js
- Django
- Java Development
- C++ Programming
- C# / .NET
- PHP Development
- Database Administration
(And more...)

### Jobs (9 sample jobs)
1. E-commerce Website Redesign
2. Mobile App Development
3. API Integration
4. Database Optimization
5. UI Component Library
6. Data Analysis Dashboard
7. Machine Learning Model
8. DevOps Setup
9. Performance Optimization

### Messages (Sample conversations)
- Between Ava and Ethan
- Between Mai and Sarah
- Between Lucas and Olivia

### Connections (Friend requests)
- Mix of accepted and pending requests
- Sample connection requests between users

---

## 🌐 API Endpoints

### Authentication

#### Register New User
- **Route:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Password@123"
  }
  ```
- **Response:** User object + JWT token
- **Status:** 201 Created

#### Login
- **Route:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "ava@prohire.app",
    "password": "Pro@12345"
  }
  ```
- **Response:** 
  ```json
  {
    "user": { "id": 2, "email": "ava@prohire.app", ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```
- **Status:** 200 OK

#### Get Current User
- **Route:** `GET /api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Current user object
- **Status:** 200 OK

---

### Professionals

#### List All Professionals
- **Route:** `GET /api/professionals`
- **Query:** `?role=professional&limit=10`
- **Response:** Array of professional profiles
- **Status:** 200 OK

#### Get Single Professional
- **Route:** `GET /api/professionals/:id`
- **Response:** Single professional with details
- **Status:** 200 OK

#### Create Professional Profile
- **Route:** `POST /api/professionals`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "Full Stack Developer",
    "bio": "Experienced MERN stack developer",
    "ratePerHour": 50,
    "skills": ["JavaScript", "React", "Node.js", "MongoDB"]
  }
  ```
- **Response:** Created profile object
- **Status:** 201 Created

#### Update Professional Profile
- **Route:** `PUT /api/professionals/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Any profile fields to update
- **Response:** Updated profile
- **Status:** 200 OK

---

### Jobs (Job Posting System)

#### List All Jobs
- **Route:** `GET /api/jobs`
- **Query:** `?status=open&category=development&limit=20`
- **Response:** Array of job listings
- **Status:** 200 OK
- **Example:**
  ```bash
  curl http://localhost:5000/api/jobs
  ```

#### Get Single Job
- **Route:** `GET /api/jobs/:id`
- **Response:** Job details with all fields
- **Status:** 200 OK

#### Create New Job
- **Route:** `POST /api/jobs`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "title": "E-commerce Website Development",
    "description": "Build a custom e-commerce platform",
    "category": "Web Development",
    "skills": ["React", "Node.js", "MongoDB", "Payment Gateway"],
    "budget": 5000,
    "deadline": "2024-12-31",
    "status": "open"
  }
  ```
- **Response:** Created job object
- **Status:** 201 Created

#### Update Job
- **Route:** `PUT /api/jobs/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Job fields to update
- **Response:** Updated job
- **Status:** 200 OK

#### Delete Job
- **Route:** `DELETE /api/jobs/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message
- **Status:** 200 OK

#### Get Jobs by Professional
- **Route:** `GET /api/professionals/:id/jobs`
- **Response:** Jobs posted by this professional
- **Status:** 200 OK

---

### Hires (Job Contracts)

#### List All Hires
- **Route:** `GET /api/hires`
- **Query:** `?status=active`
- **Response:** Array of hire contracts
- **Status:** 200 OK

#### Create Hire (Accept Job)
- **Route:** `POST /api/hires`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "jobId": 1,
    "professionalId": 2,
    "amount": 5000,
    "startDate": "2024-01-15"
  }
  ```
- **Response:** Created hire object
- **Status:** 201 Created

#### Update Hire Status
- **Route:** `PUT /api/hires/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "status": "completed"
  }
  ```
- **Response:** Updated hire
- **Status:** 200 OK

---

### Messages (Direct Messaging)

#### Get All Messages
- **Route:** `GET /api/messages`
- **Query:** `?from=2&to=3` (optional filters)
- **Response:** Array of messages
- **Status:** 200 OK

#### Get Messages with Specific User
- **Route:** `GET /api/messages?userId=2`
- **Response:** Messages with this user
- **Status:** 200 OK

#### Send Message
- **Route:** `POST /api/messages`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "toUserId": 3,
    "content": "Are you interested in the web development job?"
  }
  ```
- **Response:** Created message object
- **Status:** 201 Created

#### Delete Message
- **Route:** `DELETE /api/messages/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message
- **Status:** 200 OK

#### Mark as Read
- **Route:** `PUT /api/messages/:id/read`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Updated message
- **Status:** 200 OK

---

### Connections (Friend/Contact System)

#### Send Connection Request
- **Route:** `POST /api/connections`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "email": "ava@prohire.app"
  }
  ```
- **Response:** Connection request object
- **Status:** 201 Created

#### Get Incoming Connection Requests
- **Route:** `GET /api/connections/incoming`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of pending requests
- **Status:** 200 OK

#### Get Sent Connection Requests
- **Route:** `GET /api/connections/sent`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Requests you have sent
- **Status:** 200 OK

#### Get All Friends
- **Route:** `GET /api/connections/friends`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Accepted connections (friends)
- **Status:** 200 OK

#### Accept Connection Request
- **Route:** `PUT /api/connections/:id/accept`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Updated connection (status: accepted)
- **Status:** 200 OK

#### Reject Connection Request
- **Route:** `PUT /api/connections/:id/reject`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Updated connection (status: rejected)
- **Status:** 200 OK

---

### Categories (Skills)

#### List All Categories
- **Route:** `GET /api/categories`
- **Response:** Array of skill categories
- **Status:** 200 OK
- **Example Response:**
  ```json
  [
    { "id": 1, "name": "Web Development", "description": "..." },
    { "id": 2, "name": "Mobile Development", "description": "..." },
    ...
  ]
  ```

#### Create Category (Admin only)
- **Route:** `POST /api/categories`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "New Skill",
    "description": "Short description"
  }
  ```
- **Response:** Created category
- **Status:** 201 Created

---

### Services (Professional Services)

#### Get All Services
- **Route:** `GET /api/services`
- **Response:** Array of services offered
- **Status:** 200 OK

#### Get Services by Professional
- **Route:** `GET /api/professionals/:id/services`
- **Response:** Services offered by this professional
- **Status:** 200 OK

#### Create Service
- **Route:** `POST /api/services`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "professionalId": 2,
    "name": "Web Development Consultation",
    "description": "1-hour consultation",
    "rate": 75,
    "deliveryTime": "1 hour"
  }
  ```
- **Response:** Created service
- **Status:** 201 Created

---

### Users

#### List All Users
- **Route:** `GET /api/users`
- **Query:** `?role=professional&limit=10`
- **Response:** Array of users
- **Status:** 200 OK

#### Get Specific User
- **Route:** `GET /api/users/:id`
- **Response:** User details
- **Status:** 200 OK

#### Update User
- **Route:** `PUT /api/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** User fields to update
- **Response:** Updated user
- **Status:** 200 OK

#### Delete User (Admin/Self)
- **Route:** `DELETE /api/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message
- **Status:** 200 OK

---

## 🖥️ Frontend Features

### Pages

#### Home Page
- Landing page with features overview
- Call-to-action buttons
- Navigation to other sections

#### Authentication
- **Login:** `/login` - Email/password login
- **Register:** `/register` - Create new account
- Redirect to dashboard after login

#### Dashboard
- Overview of professional activities
- Recent jobs, messages, and connections
- Quick stats and metrics
- Responsive grid layout (2-4 columns)

#### Jobs Page
- **Browse Jobs:** List all available jobs
- **Post New Job:** Create job postings
- **Manage Jobs:** Edit/delete own jobs
- Job details with skills and budget
- Apply/hire functionality

#### Messages
- **Chat Interface:** Direct messaging with users
- **Conversation List:** Previous conversations
- **Auto-refresh:** Updates every 3 seconds
- Mobile toggle for contacts/messages
- Search and filter messages
- Fully responsive design

#### Connections
- **Browse Profiles:** Find professionals
- **View Profile:** See full professional details
- **Send Request:** Connection/friend requests
- **Manage Requests:** Accept/reject requests
- **Friends List:** View accepted connections
- Mobile-responsive grid

#### Profile Page
- **View Profile:** Your professional profile
- **Edit Profile:** Update information
- **Social Links:** LinkedIn, GitHub, Twitter, Portfolio
- **Skills:** Display expertise areas
- **Services:** Show offered services
- **Responsive Layout:** 1-2 columns based on device

#### Admin Panel
- User management
- System administration
- Content moderation

---

## 📱 Mobile Responsiveness

### Breakpoints
- **Mobile:** 320-640px (xs)
- **Tablet:** 641-1024px (sm, md)
- **Desktop:** 1025px+ (lg, xl)

### Responsive Features
- Adaptive grid layouts
- Touch-friendly buttons
- Readable font sizes
- Flexible spacing
- Mobile menu toggles
- Collapsible sections

### Tested Pages
- ✅ Dashboard - 2→4 col grid
- ✅ Messages - Toggle sidebar on mobile
- ✅ Jobs - Responsive form & listing
- ✅ Connections - 1→3 col grid
- ✅ Profile - 1→2 col layout

---

## 🔧 Database Models

### User
```javascript
{
  id: Integer (PK),
  username: String,
  email: String (unique),
  password: String (hashed),
  role: Enum (admin, professional, user),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Professional
```javascript
{
  id: Integer (PK),
  userId: Integer (FK),
  title: String,
  bio: Text,
  ratePerHour: Decimal,
  skills: JSON Array,
  profileImage: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Job
```javascript
{
  id: Integer (PK),
  professionalId: Integer (FK),
  title: String,
  description: Text,
  category: String,
  skills: JSON Array,
  budget: Decimal,
  deadline: DateTime,
  status: Enum (open, in progress, completed, cancelled),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Message
```javascript
{
  id: Integer (PK),
  fromUserId: Integer (FK),
  toUserId: Integer (FK),
  content: Text,
  isRead: Boolean,
  readAt: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Connection
```javascript
{
  id: Integer (PK),
  userId: Integer (FK),
  targetUserId: Integer (FK),
  status: Enum (pending, accepted, rejected),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Hire
```javascript
{
  id: Integer (PK),
  jobId: Integer (FK),
  professionalId: Integer (FK),
  clientId: Integer (FK),
  amount: Decimal,
  status: Enum (active, completed, cancelled),
  startDate: DateTime,
  endDate: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Category (Skills)
```javascript
{
  id: Integer (PK),
  name: String (unique),
  description: Text,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Service
```javascript
{
  id: Integer (PK),
  professionalId: Integer (FK),
  name: String,
  description: Text,
  rate: Decimal,
  deliveryTime: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## 🔒 Security Features

- **Password Hashing:** bcryptjs
- **JWT Authentication:** Token-based auth
- **Role-Based Access:** Admin, Professional, User roles
- **Protected Routes:** Frontend & backend
- **CORS Configuration:** API security
- **SQL Injection Protection:** Sequelize ORM

---

## 🧪 Testing

### Connection Test
```bash
cd prohire-backend
npm run test:db
```

### Manual API Test (with curl)

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ava@prohire.app","password":"Pro@12345"}'
```

**List Jobs:**
```bash
curl http://localhost:5000/api/jobs
```

**Send Message (requires token):**
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"toUserId":3,"content":"Hello!"}'
```

---

## 📊 Statistics

| Metric | Count | Details |
|--------|-------|---------|
| Users | 7 | 1 admin, 3 professionals, 3 clients |
| Skill Categories | 25+ | Web dev, mobile, data science, etc. |
| Sample Jobs | 9 | Various fields and budgets |
| Sample Messages | 7 | Between different users |
| Connections | 6 | Mix of accepted/pending |
| Services | Multiple | Offered by professionals |
| API Endpoints | 40+ | Full CRUD for all resources |

---

## 🚀 Starting Application

### Terminal 1 - Backend
```bash
cd prohire-backend
npm run dev
```
Server at: `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd prohire-frontend
npm run dev
```
App at: `http://localhost:5173`

### Test Accounts
- admin@prohire.app / Admin@123
- ava@prohire.app / Pro@12345
- ethan@prohire.app / User@12345

---

## 📚 Additional Resources

- **API Documentation:** Backend README.md
- **Database Setup:** MYSQL_QUICK_START.md
- **Architecture Details:** DATABASE_MIGRATION_GUIDE.md
- **Troubleshooting:** MYSQL_SETUP_GUIDE.md
- **Quick Navigation:** DATABASE_DOCUMENTATION_INDEX.md

---

## ✅ Feature Checklist

- [x] User authentication (register/login)
- [x] Role-based access control
- [x] Professional profile management
- [x] Job posting system
- [x] Job hiring/contracts
- [x] Direct messaging
- [x] Connection/friend requests
- [x] 25+ skill categories
- [x] Service offerings
- [x] Admin panel
- [x] Mobile responsiveness
- [x] MySQL database support
- [x] JWT token authentication
- [x] Error handling
- [x] Data validation
- [x] CORS security
- [x] Password hashing

---

**Last Updated:** December 2024
**Version:** 1.0.0
**Status:** Production Ready
