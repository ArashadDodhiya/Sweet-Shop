# Sweet Shop Management System 🍬

A full-stack Sweet Shop Management System built with the **MERN** stack (MongoDB, Express-via-Next.js, React, Node.js) and **Tailwind CSS**.

## Features
- **User Authentication**: Register and Login with JWT.
- **Browse Sweets**: Search and filter sweets by name or description.
- **Purchase**: Buy sweets (requires login) and track realtime stock.
- **Admin Dashboard**:
    - Add, Edit, Delete sweets.
    - Restock inventory.
    - Protected route for Admins only.
- **Responsive UI**: Pink & White modern theme using Tailwind CSS.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB (Mongoose)
- **Styling**: Tailwind CSS
- **Auth**: JOSE (JWT) + Bcryptjs

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArashadDodhiya/Sweet-Shop.git
   cd sweet_shop
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/sweetshop
   JWT_SECRET=supersecretkey123
   ```

4. **Run Locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

5. **Run Tests**
   ```bash
   npm test
   ```

## Creating an Admin User

By default, all registered users have the `user` role. To create an admin account:

### **Option 1: Using the Helper Script (Recommended)**
```bash
npm run create-admin
```
This creates an admin account with:
- **Email**: `admin@sweetshop.com`
- **Password**: `admin123`

⚠️ **Change the password after first login!**

### **Option 2: Manual Database Entry**
Connect to MongoDB and run:
```javascript
db.users.insertOne({
  email: "youradmin@example.com",
  password: "$2a$10$[bcrypt_hashed_password]",
  role: "admin"
})
```

### **Option 3: Modify Registration Code (For Production)**
You can add a secret registration key in the register API to allow admin registration:
- Add `adminKey` field to registration form
- Check if `adminKey === process.env.ADMIN_SECRET_KEY`
- If true, set `role: 'admin'`

## User Roles & Permissions

### **Regular User (`role: 'user'`)**
- Browse all sweets
- Search sweets
- Purchase sweets (decreases stock)
- View product details

### **Admin User (`role: 'admin'`)**
- All user permissions, plus:
- Access `/admin` dashboard
- Add new sweets
- Edit sweet details (name, category, price, description)
- Delete sweets
- Restock inventory (increase quantity)

## My AI Usage

**AI Tools Used**: Google Gemini (Agent Antigravity)

**How I used them**:
- **Project Structure**: Generated the initial Next.js App Router structure and configuration.
- **Boilerplate Code**: Created Mongoose schemas (`User`, `Sweet`) and API route handlers (`POST`, `GET`, `PUT`, `DELETE`).
- **Test-Driven Development**: Wrote Jest test cases for API endpoints before implementation to follow TDD practices.
- **Frontend Components**: Designed the Navbar and Sweet Card components using Tailwind CSS classes.
- **Debugging**: identified issues with imports in the test environment and suggested fixes.

**Reflection**:
AI significantly accelerated the development process, particularly in generating boilerplate code and setting up the testing environment. It allowed me to focus on the business logic (inventory management, auth flow) rather than typing out repetitive structure. The TDD workflow was streamlined as the AI could generate comprehensive test cases instantly.
