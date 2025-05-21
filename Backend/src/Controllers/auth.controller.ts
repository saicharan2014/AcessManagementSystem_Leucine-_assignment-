import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../../data-source";
import { User } from "../entities/User";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, role = "Employee" } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    // Check if role is valid
    const validRoles = ["Employee", "Manager"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ message: "Invalid role specified" });
      return;
    }

    // Check if user exists
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
      username,
      password: hashedPassword,
      role,
    });

    await userRepository.save(user);
    res.status(201).json({ message: `${role} created successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Create token payload including the user's role
    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role, // Include the role in the token
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // You might want to handle admin login differently
    if (user.role === "Admin") {
      res.status(200).json({
        message: "Admin login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } else {
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
};

// Add this to your auth controller
export const createAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password, masterKey } = req.body;

    if (masterKey !== process.env.ADMIN_MASTER_KEY) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = userRepository.create({
      username,
      password: hashedPassword,
      role: "Admin",
    });

    await userRepository.save(admin);
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error });
  }
};

export const createManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password, masterKey } = req.body;


    if (masterKey !== process.env.MANAGER_MASTER_KEY) {
      res.status(403).json({ message: "Unauthorized: Invalid master key" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { username } });


    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const manager = userRepository.create({
      username,
      password: hashedPassword,
      role: "Manager",
    });

    await userRepository.save(manager);
    res.status(201).json({ message: "Manager created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating manager", error });
  }
};
