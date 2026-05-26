# TaskFlow - Task Management Assessment

TaskFlow is a full-stack task management web application built with React, Node.js, Express, JWT authentication, and MongoDB.

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Context API, CSS
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT with protected routes and bcrypt password hashing
- Extras: Search, pagination, dark mode, admin-only route, Swagger API docs, Docker Compose, Jest unit test

## Folder Structure

```text
Task-Management-Assessment/
  Backend/
    src/
      config/          MongoDB connection
      controllers/     Route handlers
      docs/            Swagger document
      middleware/      Auth, validation, error handling
      models/          Mongoose schemas
      routes/          Express routers
      validators/      Zod request schemas and tests
  Frontend/
    src/
      components/      Auth, dashboard, task form/card
      context/         Auth context
      services/        API client
      types.ts         Shared frontend types
```

## Local Setup

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure backend environment

Create `Backend/.env`:

```env
PORT=5000
MONGODB_URI=MONGODB_URI
JWT_SECRET=JWT_SECRET
JWT_EXPIRES_IN=7d
CLIENT_URL=CLIENT_URL
```

### 3. Configure frontend environment

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Use a local MongoDB instance or run:

```bash
docker compose up mongo
```

### 5. Start the app

In two terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

Swagger docs: `http://localhost:5000/api/docs`

## Docker

To run MongoDB and the backend API:

```bash
docker compose up --build
```

Run the frontend locally with `npm run dev:frontend`.

## API Details

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Public | Register a user |
| POST | `/auth/login` | Public | Login and receive JWT |
| GET | `/auth/me` | Private | Get current user |
| GET | `/tasks` | Private | List own tasks with `status`, `search`, `page`, `limit` |
| POST | `/tasks` | Private | Create a task |
| PATCH | `/tasks/:id` | Private | Update own task |
| DELETE | `/tasks/:id` | Private | Delete own task |
| GET | `/tasks/admin/all` | Admin | List all users' tasks |

Authenticated requests require:

```http
Authorization: Bearer <jwt>
```

## Testing

```bash
npm test
```

## Assumptions

- Users can only manage their own tasks.
- Newly registered users receive the `user` role by default.
- Admin users can be promoted directly in MongoDB by setting `role` to `admin`.
- Pagination defaults to 8 tasks per page on the frontend.
