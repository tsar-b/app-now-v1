import type { Express } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { userRouter } from '../modules/users/user.routes';
import { adminRouter } from '../modules/adminCrud/admin.routes';
import { bookingRouter } from '../modules/bookings/booking.routes';
import { catalogRouter } from '../modules/catalog/catalog.routes';
import { kakaoRouter } from '../modules/integrations/kakao/kakao.routes';

export function registerRoutes(app: Express) {
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/bookings', bookingRouter);
  app.use('/api/catalog', catalogRouter);
  app.use('/api/kakao', kakaoRouter);
}
