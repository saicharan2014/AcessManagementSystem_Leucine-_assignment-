import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { Software } from "../entities/Software";

export const createSoftware = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, accessLevels } = req.body;

    const softwareRepo = AppDataSource.getRepository(Software);

    const existing = await softwareRepo.findOne({ where: { name } });
    if (existing) {
      res.status(400).json({ message: "Software already exists" });
      return;
    }

    const software = softwareRepo.create({ name, description, accessLevels });
    await softwareRepo.save(software);

    res
      .status(201)
      .json({ message: "Software created successfully", data: software });
  } catch (error) {
    res.status(500).json({ message: "Error creating software", error });
  }
};

export const getAllSoftware = async (req: Request, res: Response) => {
  try {
    const softwareRepository = AppDataSource.getRepository(Software);
    const software = await softwareRepository.find();
    res.json(software);
  } catch (error) {
    res.status(500).json({ message: "Error fetching software", error });
  }
};
