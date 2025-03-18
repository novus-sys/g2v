import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../types/express/auth";
import Contribution from "../models/Contribution";
import Group from "../models/Group";

// Create a new contribution
export const createContribution = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { groupId, amount } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid group ID",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        status: "error",
        message: "Group not found",
      });
    }

    // Check if user is a member of the group
    if (!group.members.some((member) => member.toString() === req.user?._id)) {
      return res.status(403).json({
        status: "error",
        message: "You must be a member of the group to contribute",
      });
    }

    // Check if group is open
    if (group.status !== "open") {
      return res.status(400).json({
        status: "error",
        message: "Cannot contribute to a closed or completed group",
      });
    }

    // Check if contribution would exceed target amount
    if (group.currentAmount + amount > group.targetAmount) {
      return res.status(400).json({
        status: "error",
        message: "Contribution would exceed target amount",
      });
    }

    // Create contribution
    const contribution = await Contribution.create({
      group: groupId,
      contributor: req.user._id,
      amount,
      status: "completed", // In a real app, this would be 'pending' until payment is processed
    });

    // Populate contributor details
    const populatedContribution = await contribution.populate([
      { path: "contributor", select: "firstName lastName email" },
    ]);

    return res.status(201).json({
      status: "success",
      data: populatedContribution,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        status: "error",
        message: "Error creating contribution",
        error: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Error creating contribution",
      error: "Unknown error occurred",
    });
  }
};

// Get contributions for a group
export const getGroupContributions = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { groupId } = req.params;

    if (!req.user?._id) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid group ID",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        status: "error",
        message: "Group not found",
      });
    }

    // Check if user is a member of the group
    if (!group.members.some((member) => member.toString() === req.user?._id)) {
      return res.status(403).json({
        status: "error",
        message: "You must be a member of the group to view contributions",
      });
    }

    const contributions = await Contribution.find({ group: groupId })
      .populate("contributor", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.json({
      status: "success",
      data: contributions,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        status: "error",
        message: "Error fetching contributions",
        error: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Error fetching contributions",
      error: "Unknown error occurred",
    });
  }
};
