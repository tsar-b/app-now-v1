import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware.js';
import { createBooking, getBookingHistory } from './booking.controller.js';

export const bookingRouter = Router();

bookingRouter.post('/', requireAuth, createBooking);
bookingRouter.get('/history', requireAuth, getBookingHistory);
