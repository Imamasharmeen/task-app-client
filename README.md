# Task Management Application

## Short Description

This is a Task Management Application that allows users to manage tasks by adding, editing, deleting, and organizing them into categories like **To-Do**, **In Progress**, and **Done**. The application features a drag-and-drop interface and provides real-time synchronization using **WebSockets** or **MongoDB Change Streams**. It's built with **React** for the frontend and **Express.js** for the backend, with **MongoDB** for data persistence.

---

## Live Links

- **Frontend**: [Live Frontend Link](https://task-management-3e3b3.web.app/)
- **Backend**: [Live Backend Link](https://yourbackendlink.heroku.app)

---

## Dependencies

### Frontend:

- `react`
- `react-dom`
- `vite`
- `react-router-dom`
- `react-beautiful-dnd` (or any other drag-and-drop library)
- `firebase`
- `axios`
- `framer-motion`

### Backend:

- `express`
- `mongoose`
- `dotenv`
- `mongodb-change-streams` (for real-time updates)

### Development Tools:

- `nodemon` (for auto-reloading server during development)
- `concurrently` (to run frontend and backend simultaneously in development)

---

## Installation Steps

### 1. Clone the repository

```bash
git clone https://github.com/aburaihan98/task-management-client
cd task-management-client
```

### 2. Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

   - **MongoDB** connection URL
   - **Firebase credentials** (for Firebase Authentication)

4. Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables for Firebase in a `.env` file (e.g., `REACT_APP_FIREBASE_API_KEY`, etc.).

4. Start the frontend development server:

```bash
npm run dev
```

---

## Technologies Used

- **Frontend**:

  - React
  - Vite.js
  - React Router
  - React Beautiful DnD (or similar library for drag-and-drop functionality)
  - Firebase Authentication
  - Axios (for HTTP requests)
  - Framer motion`

- **Backend**:

  - Express.js
  - MongoDB (via Mongoose)
  - Firebase Admin SDK (for user authentication)
  - MongoDB Change Streams (for real-time updates)

- **Development Tools**:

  - Vite.js
  - Nodemon
  - Concurrently

- **Deployment**:
  - Vercel (for frontend)
  - Heroku (for backend)
