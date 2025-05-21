import * as express from "express";
import * as cors from "cors";
import { AppDataSource } from "../data-source";
import { authenticateJWT, authorizeRole } from "./middleware/auth";
import {
  signup,
  login,
  createAdmin,
  createManager,
} from "./Controllers/auth.controller";

import {
  createSoftware,
  getAllSoftware,
} from "./Controllers/software.controller";
import {
  createRequest,
  getPendingRequests,
  updateRequestStatus,
  getUserRequests,
} from "./Controllers/request.controller";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// Routes
app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);
app.post("/api/create-admin", createAdmin);
app.post("/api/create-manager", createManager);
// Software routes (Admin only)
app.post(
  "/api/software",
  authenticateJWT,
  authorizeRole(["Admin"]),
  createSoftware
);

app.get("/api/software", authenticateJWT, getAllSoftware);

// Request routes
app.post("/api/requests", authenticateJWT, createRequest);
app.get(
  "/api/requests/pending",
  authenticateJWT,
  authorizeRole(["Manager", "Admin"]),
  getPendingRequests
);
app.patch(
  "/api/requests/:id",
  authenticateJWT,
  authorizeRole(["Manager", "Admin"]),
  updateRequestStatus
);
app.get("/api/requests/my", authenticateJWT, getUserRequests);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
