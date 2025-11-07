import express from 'express';
import {
    getEvents,
    getEvent,
    createNewEvent,
    updateExistingEvent,
    deleteExistingEvent,
    testEventEndpoint
} from '../controllers/eventController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/test', testEventEndpoint);
router.get('/', getEvents);
router.get('/:id', getEvent); // not sure why this is not protected
router.post('/', protect, createNewEvent);
router.put('/:id', protect, updateExistingEvent);
router.delete('/:id', protect, deleteExistingEvent);

export default router;