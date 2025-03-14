import { Request, Response } from 'express';
import Group from '../models/Group';
import mongoose from 'mongoose';
import { AuthRequest } from '../types/express/auth';

// Create new group
export const createGroup = async (req: AuthRequest, res: Response): Promise<Response> => {
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
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const group = await Group.create({
      name,
      description,
      creator: new mongoose.Types.ObjectId(req.user._id),
      members: [new mongoose.Types.ObjectId(req.user._id)],
      maxMembers,
      category,
      targetAmount,
      expiryDate,
      image,
      rules,
    });

    return res.status(201).json(group);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating group', error });
  }
};

// Get all groups
export const getGroups = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { status, category } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;

    const groups = await Group.find(query)
      .populate('creator', 'firstName lastName email')
      .populate('members', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return res.json(groups);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching groups', error });
  }
};

// Get single group
export const getGroup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'firstName lastName email')
      .populate('members', 'firstName lastName email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    return res.json(group);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching group', error });
  }
};

// Update group
export const updateGroup = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if user is the creator
    if (group.creator.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized to update this group' });
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('creator', 'firstName lastName email')
     .populate('members', 'firstName lastName email');

    return res.json(updatedGroup);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating group', error });
  }
};

// Join group
export const joinGroup = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (group.status !== 'open') {
      return res.status(400).json({ message: 'Group is not open for joining' });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ message: 'Group is full' });
    }

    group.members.push(userId);
    await group.save();

    const updatedGroup = await Group.findById(req.params.id)
      .populate('creator', 'firstName lastName email')
      .populate('members', 'firstName lastName email');

    return res.json(updatedGroup);
  } catch (error) {
    return res.status(500).json({ message: 'Error joining group', error });
  }
};

// Leave group
export const leaveGroup = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (group.creator.toString() === req.user._id) {
      return res.status(400).json({ message: 'Creator cannot leave the group' });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== req.user?._id
    );
    await group.save();

    const updatedGroup = await Group.findById(req.params.id)
      .populate('creator', 'firstName lastName email')
      .populate('members', 'firstName lastName email');

    return res.json(updatedGroup);
  } catch (error) {
    return res.status(500).json({ message: 'Error leaving group', error });
  }
}; 