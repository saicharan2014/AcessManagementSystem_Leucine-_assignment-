🧭 User Access Management System
A comprehensive system for managing user access to software applications with role-based permissions and approval workflows.

🌟 Features
🔐 Authentication
User registration (default role: Employee)

JWT-based login system

Role-based redirection after login

👥 User Roles
Employee: Can request software access

Manager: Can approve/reject access requests

Admin: Can create new software entries

📋 Core Functionalities
Software listing and creation (Admin only)

Access request submission (Employees)

Request approval/rejection (Managers)

🛠️ Tech Stack
Backend
Node.js + Express.js

TypeORM (PostgreSQL)

JWT authentication

Bcrypt for password hashing

Frontend
React

Role-based views and routing

🗄️ Database Schema
Entities
User

id, username, password, role (Employee/Manager/Admin)

Software

id, name, description, accessLevels (Read/Write/Admin)

Request

id, user (FK), software (FK), accessType, reason, status (Pending/Approved/Rejected)

🚀 Setup Instructions
Prerequisites
Node.js (v14+)

PostgreSQL

Yarn/npm

Backend Setup
Install dependencies:

bash
cd backend
npm install
Create .env file based on .env.example

Run migrations:

bash
npm run typeorm migration:run
Start dev server:

bash
npm run dev
Frontend Setup
Install dependencies:

bash
cd frontend
npm install
Start React app:

bash
npm start
📡 API Endpoints
Authentication
POST /api/auth/signup - User registration

POST /api/auth/login - User login (returns JWT)

Software Management (Admin only)
POST /api/software - Create new software

Access Requests
POST /api/requests - Submit access request (Employee)

PATCH /api/requests/:id - Approve/reject request (Manager)

🖥️ Frontend Pages
/signup - Registration page

/login - Login page

/create-software - Software creation (Admin)

/request-access - Request submission (Employee)

/pending-requests - Request management (Manager)

🔒 Security Features
JWT authentication with expiration

Password hashing with bcrypt

Role-based access control

Environment variables for sensitive data


🔑 Master Keys Configuration
The system uses predefined master keys for initial admin and manager account setup. These should be added to your .env file:

env
ADMIN_MASTER_KEY=e825796e668524ff6b3352857eaed7805deeff121842e9a4d5b32f5ca471a1e6
MANAGER_MASTER_KEY=3e6c85d4488ccf0317c244956306a58e9002d1762e148c8d13041c076e190477
Usage Instructions:
Initial Setup:

Use these keys during the first-time setup to create admin and manager accounts

The keys should be provided in the signup request for these privileged roles

Security Notes:

These keys should be kept secret and never committed to version control

Rotate these keys periodically in production environments

Consider using a key management service for production deployments

Implementation Details:

The backend verifies these keys when creating admin/manager accounts

Regular employee accounts don't require a master key

The keys are only used during account creation, not for regular authentication
