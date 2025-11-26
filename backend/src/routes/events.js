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
import { uploadEventImage, handleMulterErr } from '../middleware/fileUpload.js';

const router = express.Router();

router.get('/test', testEventEndpoint);
router.get('/', getEvents);
router.get('/:id', getEvent); // not sure why this is not protected
router.post('/', protect, uploadEventImage, handleMulterErr, createNewEvent);
router.put('/:id', protect, uploadEventImage, handleMulterErr, updateExistingEvent);
router.delete('/:id', protect, deleteExistingEvent);

export default router;