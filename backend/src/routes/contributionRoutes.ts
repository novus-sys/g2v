import { Router } from "express";
import { auth } from "../middleware/auth";
import { z } from "zod";
import { validateRequest } from "../middleware/validateRequest";
import {
  createContribution,
  getGroupContributions,
} from "../controllers/contributionController";

const router = Router();

// Validation schema for creating a contribution
const contributionSchema = z.object({
  body: z.object({
    groupId: z.string().min(1, "Group ID is required"),
    amount: z.number().positive("Amount must be positive"),
  }),
});

// Contribution routes
router.post("/", auth, validateRequest(contributionSchema), createContribution);
router.get("/group/:groupId", auth, getGroupContributions);

export default router;
