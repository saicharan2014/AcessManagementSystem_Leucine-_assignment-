import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Request as AccessRequest } from "../entities/Request";
import { User } from "../entities/User";
import { Software } from "../entities/Software";

// Create a new request
export const createRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { softwareId, accessType, reason } = req.body;
    const userId = (req as any).user.userId;

    const requestRepo = AppDataSource.getRepository(AccessRequest);
    const userRepo = AppDataSource.getRepository(User);
    const softwareRepo = AppDataSource.getRepository(Software);

    const user = await userRepo.findOneBy({ id: userId });
    const software = await softwareRepo.findOneBy({ id: softwareId });

    if (!user || !software) {
      res.status(400).json({ message: "Invalid user or software" });
      return;
    }

    const newRequest = requestRepo.create({
      user,
      software,
      accessType,
      reason,
      status: "Pending",
    });

    await requestRepo.save(newRequest);

    res
      .status(201)
      .json({ message: "Request created successfully", data: newRequest });
  } catch (error) {
    console.error("Create Request Error:", error);
    res.status(500).json({ message: "Error creating request", error });
  }
};

// Get all pending requests (for admin)
export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    const requestRepo = AppDataSource.getRepository(AccessRequest);

    const requests = await requestRepo.find({
      where: { status: "Pending" },
      relations: ["user", "software"],
    });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending requests", error });
  }
};

// Update request status (Approve/Reject)
export const updateRequestStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const requestRepo = AppDataSource.getRepository(AccessRequest);
    const request = await requestRepo.findOne({
      where: { id: parseInt(id) },
    });

    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    if (!["Approved", "Rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    request.status = status as "Approved" | "Rejected";
    await requestRepo.save(request);

    res.status(200).json({ message: "Request updated successfully", request });
  } catch (error) {
    res.status(500).json({ message: "Error updating request", error });
  }
};

// Get requests created by the logged-in user
export const getUserRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const requestRepo = AppDataSource.getRepository(AccessRequest);

    const requests = await requestRepo.find({
      where: { user: { id: userId } },
      relations: ["software"],
    });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user requests", error });
  }
};
