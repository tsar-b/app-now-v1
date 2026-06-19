import { Router } from 'express';
import { requireAuth } from '../../middleware/authMiddleware';
import { createBooking, getBookingHistory } from './booking.controller';

export const bookingRouter = Router();

bookingRouter.post('/', requireAuth, createBooking);
bookingRouter.get('/history', requireAuth, getBookingHistory);
