import express from 'express';
import protect from '../middlewares/auth.middlewares.js';
import {
  generateShareLink,
  getSharedResource,
  getShareLinks,
  deleteShareLink,
  updateShareLink,
} from '../controllers/share.controllers.js';

const router = express.Router();

// Public routes - no authentication required
// @desc Get shared resource
// @route GET /api/share/:token
router.get('/:token', getSharedResource);

// Protected routes - authentication required
router.use(protect);

// @desc Generate a new share link
// @route POST /api/share/generate
router.post('/generate', generateShareLink);

// @desc Get all share links of current user
// @route GET /api/share/my-links/all
router.get('/my-links/all', getShareLinks);

// @desc Delete/revoke a share link
// @route DELETE /api/share/:token
router.delete('/:token', deleteShareLink);

// @desc Update share link settings
// @route PATCH /api/share/:token
router.patch('/:token', updateShareLink);

export default router;
