# 🌐 TelcoCare Frontend

A modern React-based web application for customer support and ticket management, developed for telecommunication companies.

The frontend provides an intuitive interface for managing customers, tickets, categories, reports, and employee operations while communicating with the TelcoCare Spring Boot backend.

---

## ✨ Features

- Secure JWT Authentication
- Dashboard with real-time statistics
- Customer Management
- Customer Search & Filtering
- Create New Customer
- Ticket Management
- Create Ticket
- Ticket Assignment
- My Tickets
- Ticket Activity Timeline
- Ticket Status & Priority Updates
- Category & Subcategory Management
- Default Priority Configuration
- Reports & Analytics
- User Profile
- Secure Logout
- Responsive Web Interface

---

## 📂 Pages

- Login
- Dashboard
- Customers
- Tickets
- Ticket Detail
- My Tickets
- Categories
- Reports
- Settings

---

## 🎫 Ticket Workflow

```
OPEN
   ↓
IN_PROGRESS
   ↓
ON_HOLD
   ↓
RESOLVED
   ↓
CLOSED
```

Every important action is recorded in the Ticket Activity Timeline.

Examples include:

- Ticket Created
- Ticket Assigned
- Status Changed
- Priority Changed
- Description Updated

---

## ⚙️ Business Rules

The frontend dynamically adapts according to backend business rules.

Examples:

- Default priority is automatically selected from the chosen subcategory.
- Some subcategories require Province and District information.
- Potential customers can only create informational tickets.
- Existing customers can access all available ticket categories.
- Tickets can be assigned during creation or later from the ticket pool.

---

## 📊 Reports

The Reports page provides live analytics, including:

- Total Tickets
- Open Tickets
- Critical Tickets
- Resolution Rate
- Most Active Category
- Province Distribution
- Priority Distribution
- Customer Status Distribution
- Daily Ticket Trends

---

## 🛠️ Tech Stack

- React
- Vite
- React Router
- JavaScript (ES6)
- CSS3
- Fetch API
- Recharts
- Lucide React

---

## 📁 Project Structure

```text
src/
│
├── assets/
├── components/
├── pages/
│   ├── Dashboard/
│   ├── Customers/
│   ├── Tickets/
│   ├── MyTickets/
│   ├── Categories/
│   ├── Reports/
│   ├── Settings/
│   └── Login/
│
├── services/
│   ├── authService.js
│   ├── customerService.js
│   ├── ticketService.js
│   ├── categoryService.js
│   ├── reportsService.js
│   └── locationService.js
│
├── App.jsx
└── main.jsx
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following software is installed:

- Node.js (v18 or later)
- npm
- Git
- TelcoCare Backend

---

## Clone the Repository

```bash
git clone https://github.com/yourusername/telcocare-frontend.git
cd telcocare-frontend
```

---

## Install Dependencies

```bash
npm install
```

---

## Start the Development Server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Build for Production

```bash
npm run build
```

---

## Preview Production Build

```bash
npm run preview
```

---

## 🔗 Backend

Before running the frontend, make sure the **TelcoCare Backend** is running.

By default, the frontend communicates with:

```
http://localhost:8080/api
```

If the backend runs on another address, update the API base URL in the service files or configure it using environment variables.

---

## 🔐 Authentication

Authentication is handled using JWT.

After a successful login:

- The JWT token is stored in Local Storage.
- Every protected request automatically includes:

```text
Authorization: Bearer <token>
```

Logging out removes the stored token and redirects the user to the login page.

---

## 📈 Main Modules

### Dashboard

Displays system statistics and operational summaries.

### Customers

Manage customer information, search customers, and update customer status.

### Tickets

Create, assign, update, and monitor support tickets.

### My Tickets

Displays tickets assigned to the authenticated employee.

### Categories

Manage categories, subcategories, default priorities, and business rules.

### Reports

Visualize ticket and customer analytics using backend-generated data.

### Settings

Configure default priorities and view authenticated user information.

---

## 💡 Future Improvements

- SLA Monitoring
- Email Notifications
- Export Reports (PDF / Excel)
- Role-Based Authorization
- Dark Mode
- Docker Deployment
- Unit & Integration Tests

---

## 📄 License

This project was developed for educational and portfolio purposes.
