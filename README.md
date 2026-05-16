# Global TNA Service Request Board

A production-ready, professional service request platform built with **Next.js 16**, **Express**, and **MongoDB**. This platform allows users to post anonymous or identified service requests (Training Needs Analysis) and manage them through a sleek, high-density interface.

## 🚀 Features
- **Anonymous & Registered Posting**: Post requests either as a ghost user or a verified member.
- **High-Density UI**: Premium two-column detail views for maximized information visibility.
- **Real-time Status Management**: Admins and owners can update request states (Open, In Progress, Closed).
- **SSR Optimized**: Built for speed and SEO with hydration-guarded Next.js components.
- **Type Safe**: Fully implemented TypeScript interfaces across the entire stack.

## 🧩 Detailed Feature Breakdown

### **1. Authentication & Security**
- **JWT Protection**: Secure token-based authentication for all private actions.
- **Bcrypt Hashing**: Industry-standard password encryption.
- **Role-Based Access**: System prepared for standard 'user' and 'admin' roles.

### **2. Service Request Management (Full CRUD)**
- **Dual-Posting Modes**: 
    - **Registered**: Post requests linked to your profile with automatic contact info filling.
    - **Anonymous**: Post as a "Ghost" user with unique tracker IDs (`anonId`).
- **Dynamic Updates**: Real-time status switching (Open → In Progress → Closed).
- **Secure Deletion**: Ownership-verified deletion logic to prevent unauthorized removal.

### **3. Modern User Interface**
- **High-Density Layout**: Optimized side-by-side view for Request Descriptions and Client Contacts.
- **Real-Time Filtering**: Instant keyword search and category-based sorting.
- **Micro-Animations**: Smooth hover transitions on card dividers and interactive elements.
- **Premium Aesthetics**: Curated maroon-themed palette with modern Outfit typography.

---

## 🛠️ Environment Configuration

### **Backend (`backend/.env`)**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/global-tna
JWT_SECRET=your_super_secret_jwt_key_here
```

### **Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📦 Database Models

### **User Model**
- `name`: Full name of the user.
- `email`: Unique login email.
- `password`: Hashed credentials.
- `role`: 'user' or 'admin'.

### **JobRequest Model**
- `title`: Short descriptive title (auto-capitalized).
- `description`: Detailed service/training brief.
- `category`: Plumbing, Electrical, Painting, Joinery, General.
- `location`: Service location.
- `contactName`: Name of the contact person.
- `contactEmail`: Valid email for notifications.
- `status`: Open, In Progress, Closed.
- `postedBy`: User ID or 'Anonymous'.
- `anonId`: Unique tracker for ghost posts.

---

## 🚦 Getting Started

Follow these steps to get the system up and running:

### **1. Setup Environment**
1.  **Backend**: Copy `backend/.env` template and add your `MONGODB_URI`.
2.  **Frontend**: Ensure `frontend/.env.local` points to your backend URL.
3.  **Install**: Run `npm install` in both the `backend` and `frontend` directories.

### **2. Launch System**
```bash
# Start Backend (on port 5000)
cd backend && npm start

# Start Frontend (on port 3000)
cd frontend && npm run dev
```

---

## 🧪 Verification Flow (Check if it works)

To confirm everything is working perfectly, follow this simple checklist:

1.  **Anonymous Post**: Click **"POST REQUEST"** on the home page. Use the **Anonymous** tab to submit a request. Verify it appears instantly on the board.
2.  **User Registration**: Click **"SIGN IN"** in the header. Switch to **"JOIN NOW"** and create a new account.
3.  **Identified Post**: While logged in, post another request. Notice your name and email are automatically filled.
4.  **Admin Check**: Click on your own request to open the detail view. Try changing the status (e.g., to **In Progress**).
5.  **API Check**: Import `backend/Global_TNA_Postman_Collection.json` into Postman and run the **"Get All Jobs"** request.

---

## 🧪 Running Tests
The project uses **Vitest** for both frontend and backend testing.
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

---

## 🔮 Future Roadmap (Promises)
We are committed to evolving the platform with the following high-impact features:
- [ ] **Personalized View**: Automatically prioritize and pin a user's own listings to the top of the board upon login for quick access.
- [ ] **Advanced Categorization**: Implement smart filtering and grouping of cards based on **Status** and **Creation Date** to improve board navigation.
- [ ] **Dynamic Sidebar**: A collapsible, interactive navigation hub for category quick-switching.
- [ ] **Premium Theme Toggling**: Seamless switching between dedicated deep-black and stark-white "Executive" themes.
- [ ] **Full Dockerization**: Containerize both services with Docker and Docker Compose for seamless environment-agnostic deployment.

---

