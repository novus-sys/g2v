import { Router } from 'express';
import { auth } from '../middleware/auth';
import { z } from 'zod';
import { groupSchema } from '../validations/groupSchema';
import { validateRequest } from '../middleware/validateRequest';
import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  joinGroup,
  leaveGroup,
  deleteGroup,
  kickMember,
  transferOwnership,
  updateStatus,
} from '../controllers/groupController';

const router = Router();

// Group routes
router.get('/', auth, getGroups);
router.post('/',auth, createGroup);
router.get('/:id', auth, getGroup);
router.put('/:id', auth, validateRequest(groupSchema), updateGroup);
router.delete('/:id', auth, deleteGroup);
router.post('/:id/join', auth, joinGroup);
router.post('/:id/leave', auth, leaveGroup);
router.post('/:id/kick/:memberId', auth, kickMember);
router.post('/:id/transfer/:newOwnerId', auth, transferOwnership);
router.patch('/:id/status', auth, validateRequest(z.object({ status: z.enum(['open', 'closed', 'completed']) })), updateStatus);

export default router; 