import { Router } from 'express';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { groupSchema } from '../validations/groupSchema';
import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  joinGroup,
  leaveGroup,
} from '../controllers/groupController';

const router = Router();

// Group routes
router.get('/', auth, getGroups);
router.post('/', auth, validateRequest(groupSchema), createGroup);
router.get('/:id', auth, getGroup);
router.put('/:id', auth, validateRequest(groupSchema), updateGroup);
router.post('/:id/join', auth, joinGroup);
router.post('/:id/leave', auth, leaveGroup);

export default router; 