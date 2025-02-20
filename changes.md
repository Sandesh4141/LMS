### **🚀 Task: Improve MVC Architecture and Routing in Your Node.js Express App**

#### **📝 Objective**
goal is to **separate admin and student routes**, ensuring a **proper MVC structure** and **implement role-based access control (RBAC)** to restrict admin-only operations.

---

## **✅ Task Breakdown**
### **1️⃣ Restructure Routes**
- **Move Admin-specific student operations to a new route file:**
  - 📂 `/routes/admin/student.routes.js`
- **Move Student-specific operations to a new route file:**
  - 📂 `/routes/student/student.routes.js`
- **Update `server.js`** to use the correct routes.

---

### **2️⃣ Implement Role-Based Access Control (RBAC)**
- **Create an authentication middleware:**
  - 📂 `/middlewares/authMiddleware.js`
- **Restrict Admin Operations:** Only allow **admins** to add, delete, or update students.
- **Restrict Student Operations:** Ensure students can only access their own dashboard/profile.

---

### **3️⃣ Test API Endpoints in Postman**
- **Test Admin Routes (`/admin/students`)**
  - ✅ `POST /admin/students` (Create student) **(Admin only)**
  - ✅ `GET /admin/students` (Fetch all students) **(Admin only)**
  - ✅ `PUT /admin/students/:id` (Update student) **(Admin only)**
  - ✅ `DELETE /admin/students/:id` (Delete student) **(Admin only)**

- **Test Student Routes (`/students/:id/dashboard`)**
  - ✅ `GET /students/:id/dashboard` (Student dashboard) **(Students only)**
  - ✅ `GET /students/:id/credentials` (Fetch login credentials) **(Students only)**

### **🛠 Deliverables**
- [ ] **Proper MVC structure** with separate routes for admin and students.
- [ ] **Role-based authentication middleware (`authMiddleware.js`)**.
- [ ] **Updated `server.js` with correct route mounting**.
- [ ] **Test API endpoints in Postman and document results**.




### **Answer:**  
Your **models and controllers are mostly fine**, but you still **need to move them into separate files** for better structure. Right now, you have everything in **one file**, which is not good for **scalability and maintainability**.

#### **✅ What You NEED to Change in Models & Controllers**
1. **Move each model into its own file inside `/models/`** (e.g., `student.model.js`, `teacher.model.js`).
2. **Move controllers into `/controllers/`** (e.g., `student.controller.js`, `teacher.controller.js`).
3. **Do NOT mix models and business logic inside routes** (keep it clean).
4. **Ensure models only interact with the database, and controllers handle logic**.

---

## **🚀 Task List: Improve Backend Architecture**
#### **📝 Objective:**  
You need to **fully implement MVC architecture** by properly organizing models, controllers, routes, and middleware.

---

### **📂 Task 1: Restructure Folder & Files**
#### ✅ **Refactor your backend into this structure:**
```
/project-root
│── /models                 # Database interaction (Data Layer)
│   ├── student.model.js
│   ├── teacher.model.js
│   ├── course.model.js
│   ├── subject.model.js
│   ├── department.model.js
│
│── /controllers            # Business logic (Controller Layer)
│   ├── student.controller.js
│   ├── teacher.controller.js
│   ├── course.controller.js
│   ├── subject.controller.js
│   ├── department.controller.js
│
│── /routes                 # API Endpoints (Routing Layer)
│   ├── admin               # Separate admin routes
│   │   ├── student.routes.js
│   │   ├── teacher.routes.js
│   │   ├── course.routes.js
│   │   ├── department.routes.js
│   ├── student             # Separate student routes
│   │   ├── student.routes.js
│   │   ├── timetable.routes.js
│   │   ├── subject.routes.js
│
│── /middlewares            # Authentication, error handling
│   ├── authMiddleware.js   # Protect routes (Admin/Student)
│   ├── errorMiddleware.js  # Handle errors
│
│── /config                 # DB config, environment settings
│   ├── database.js         # PostgreSQL connection
│   ├── dotenv.config.js
│
│── server.js               # Main Express server
│── package.json            # Dependencies
│── .env                    # Environment variables
│── README.md               # Project documentation
```

---

### **📂 Task 2: Separate Routes for Admin & Students**
#### ✅ **Create & Implement These Route Files**
| **File** | **Purpose** |
|-----------|------------|
| `/routes/admin/student.routes.js` | Admin-only student management (CRUD) |
| `/routes/admin/teacher.routes.js` | Admin-only teacher management (CRUD) |
| `/routes/student/student.routes.js` | Student dashboard, profile access |
| `/routes/student/timetable.routes.js` | Student timetable routes |

---

### **📂 Task 3: Implement Role-Based Authentication**
#### ✅ **Create `authMiddleware.js`**
1. Restrict **admin operations** (only admins can create, update, or delete students).
2. Restrict **student access** (students can only access their own profile/dashboard).

---

### **📂 Task 4: Test API Endpoints in Postman**
#### ✅ **Test These API Endpoints**
| **Endpoint** | **Method** | **Access** | **Expected Behavior** |
|-------------|-----------|------------|-----------------------|
| `/admin/students` | `GET` | Admin only | Fetch all students |
| `/admin/students/:id` | `GET` | Admin only | Fetch specific student |
| `/admin/students` | `POST` | Admin only | Create a new student |
| `/admin/students/:id` | `PUT` | Admin only | Update a student |
| `/admin/students/:id` | `DELETE` | Admin only | Delete a student |
| `/students/:id/dashboard` | `GET` | Student only | Fetch student dashboard |
| `/students/:id/credentials` | `GET` | Student only | Fetch student credentials |

---

### **⏳ Deadline:** _(Set a deadline based on your priority)_
Let me know if you need help at any step! 🚀🔥