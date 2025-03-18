import { Request, Response } from "express";
import Group from "../models/Group";
import mongoose from "mongoose";
import { AuthRequest } from "../types/express/auth";

// Create new group
export const createGroup = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const {
      name,
      description,
      maxMembers,
      category,
      targetAmount,
      expiryDate,
      image,
      rules,
    } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated",
      });
    }

    // Validate expiry date
    const expiryDateObj = new Date(expiryDate);
    if (expiryDateObj <= new Date()) {
      return res.status(400).json({
        status: "error",
        message: "Expiry date must be in the future",
      });
    }

    const group = await Group.create({
      name,
      description,
      creator: new mongoose.Types.ObjectId(req.user._id),
      members: [new mongoose.Types.ObjectId(req.user._id)],
      maxMembers,
      category,
      targetAmount,
      expiryDate: expiryDateObj,
      image,
      rules,
      currentAmount: 0,
      status: "open",
    });

    const populatedGroup = await group.populate([
      { path: "creator", select: "firstName lastName email" },
      { path: "members", select: "firstName lastName email" },
    ]);

    return res.status(201).json({
      status: "success",
      data: populatedGroup,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        status: "error",
        message: "Error creating group",
        error: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Error creating group",
      error: "Unknown error occurred",
    });
  }
};

// Get all groups
export const getGroups = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { status, category, creator, member } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (creator) query.creator = new mongoose.Types.ObjectId(creator as string);
    if (member) query.members = new mongoose.Types.ObjectId(member as string);

    const groups = await Group.find(query)
      .populate("creator", "firstName lastName email")
      .populate("members", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.json(groups);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error fetching groups", error: error.message });
    }
    return res.status(500).json({
      message: "Error fetching groups",
      error: "Unknown error occurred",
    });
  }
};

// Get single group
export const getGroup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    const group = await Group.findById(req.params.id)
      .populate("creator", "firstName lastName email")
      .populate("members", "firstName lastName email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.json(group);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error fetching group", error: error.message });
    }
    return res.status(500).json({
      message: "Error fetching group",
      error: "Unknown error occurred",
    });
  }
};

// Update group
export const updateGroup = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if user is the creator
    if (group.creator.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this group" });
    }

    // Validate expiry date if it's being updated
    if (req.body.expiryDate) {
      const expiryDateObj = new Date(req.body.expiryDate);
      if (expiryDateObj <= new Date()) {
        return res
          .status(400)
          .json({ message: "Expiry date must be in the future" });
      }
      req.body.expiryDate = expiryDateObj;
    }

    // Prevent updating certain fields
    delete req.body.creator;
    delete req.body.members;
    delete req.body.currentAmount;

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    )
      .populate("creator", "firstName lastName email")
      .populate("members", "firstName lastName email");

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found after update" });
    }

    return res.json(updatedGroup);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error updating group", error: error.message });
    }
    return res.status(500).json({
      message: "Error updating group",
      error: "Unknown error occurred",
    });
  }
};

// Join group
export const joinGroup = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (group.status !== "open") {
      return res.status(400).json({ message: "Group is not open for joining" });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    if (
      group.members.some((member) => member.toString() === userId.toString())
    ) {
      return res
        .status(400)
        .json({ message: "Already a member of this group" });
    }

    if (group.members.length >= group.maxMembers) {
      group.status = "closed";
      await group.save();
      return res.status(400).json({ message: "Group is full" });
    }

    // Check if group has expired
    if (new Date(group.expiryDate) <= new Date()) {
      group.status = "closed";
      await group.save();
      return res.status(400).json({ message: "Group has expired" });
    }

    group.members.push(userId);
    await group.save();

    const updatedGroup = await Group.findById(req.params.id)
      .populate("creator", "firstName lastName email")
      .populate("members", "firstName lastName email");

    return res.json(updatedGroup);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error joining group", error: error.message });
    }
    return res.status(500).json({
      message: "Error joining group",
      error: "Unknown error occurred",
    });
  }
};

// Leave group
export const leaveGroup = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (group.creator.toString() === req.user._id) {
      return res
        .status(400)
        .json({ message: "Creator cannot leave the group" });
    }

    const initialMemberCount = group.members.length;
    group.members = group.members.filter(
      (member) => member.toString() !== req.user?._id
    );

    // If no members were removed, the user wasn't in the group
    if (initialMemberCount === group.members.length) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }

    await group.save();

    const updatedGroup = await Group.findById(req.params.id)
      .populate("creator", "firstName lastName email")
      .populate("members", "firstName lastName email");

    return res.json(updatedGroup);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error leaving group", error: error.message });
    }
    return res.status(500).json({
      message: "Error leaving group",
      error: "Unknown error occurred",
    });
  }
};

// Delete group
export const deleteGroup = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Only creator can delete the group
    if (group.creator.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this group" });
    }

    // Don't allow deletion if group is completed
    if (group.status === "completed") {
      return res
        .status(400)
        .json({ message: "Cannot delete a completed group" });
    }

    await Group.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error deleting group", error: error.message });
    }
    return res.status(500).json({
      message: "Error deleting group",
      error: "Unknown error occurred",
    });
  }
};

// Kick member from group
export const kickMember = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.memberId)) {
      return res.status(400).json({ message: "Invalid member ID format" });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Only creator can kick members
    if (group.creator.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to kick members from this group" });
    }

    const memberIdToKick = req.params.memberId;

    // Cannot kick the creator
    if (group.creator.toString() === memberIdToKick) {
      return res.status(400).json({ message: "Cannot kick the group creator" });
    }

    const initialMemberCount = group.members.length;
    group.members = group.members.filter(
      (member) => member.toString() !== memberIdToKick
    );

    // If no members were removed, the user wasn't in the group
    if (initialMemberCount === group.members.length) {
      return res
        .status(400)
        .json({ message: "User is not a member of this group" });
    }

    await group.save();

    const updatedGroup = await Group.findById(req.params.id)
      .populate("creator", "firstName lastName email")
      .populate("members", "firstName lastName email");

    return res.json(updatedGroup);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error kicking member", error: error.message });
    }
    return res.status(500).json({
      message: "Error kicking member",
      error: "Unknown error occurred",
    });
  }
};

// Transfer group ownership
export const transferOwnership = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.newOwnerId)) {
      return res.status(400).json({ message: "Invalid new owner ID format" });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Only current owner can transfer ownership
    if (group.creator.toString() !== req.user._id) {
      return res.status(403).json({
        message: "Not authorized to transfer ownership of this group",
      });
    }

    const newOwnerId = req.params.newOwnerId;

    // Check if new owner is a member of the group
    if (!group.members.some((member) => member.toString() === newOwnerId)) {
      return res
        .status(400)
        .json({ message: "New owner must be a member of the group" });
    }

    group.creator = new mongoose.Types.ObjectId(newOwnerId);
    await group.save();

    const updatedGroup = await Group.findById(req.params.id)
      .populate("creator", "firstName lastName email")
      .populate("members", "firstName lastName email");

    return res.json(updatedGroup);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error transferring ownership",
        error: error.message,
      });
    }
    return res.status(500).json({
      message: "Error transferring ownership",
      error: "Unknown error occurred",
    });
  }
};

// Update group status
export const updateStatus = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid group ID format" });
    }

    const { status } = req.body;

    if (!status || !["open", "closed", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Only creator can update status
    if (group.creator.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update status of this group" });
    }

    // Validate status transitions
    if (group.status === "completed" && status !== "completed") {
      return res
        .status(400)
        .json({ message: "Cannot change status of a completed group" });
    }

    if (status === "open" && group.members.length >= group.maxMembers) {
      return res
        .status(400)
        .json({ message: "Cannot set status to open when group is full" });
    }

    if (status === "open" && new Date(group.expiryDate) <= new Date()) {
      return res
        .status(400)
        .json({ message: "Cannot set status to open when group has expired" });
    }

    group.status = status;
    await group.save();

    const updatedGroup = await Group.findById(req.params.id)
      .populate("creator", "firstName lastName email")
      .populate("members", "firstName lastName email");

    return res.json(updatedGroup);
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ message: "Error updating group status", error: error.message });
    }
    return res.status(500).json({
      message: "Error updating group status",
      error: "Unknown error occurred",
    });
  }
};
