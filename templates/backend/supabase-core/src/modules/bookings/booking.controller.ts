import type { Request, Response } from 'express';
import { HttpError } from '../../core/errors.js';
import { supabaseAdmin } from '../../db/supabaseAdmin.js';

export async function createBooking(req: Request, res: Response) {
  const payload = {
    ...req.body,
    user_id: req.user!.id,
    legacy_user_id: req.user!.legacyUserId ?? null,
    status: req.body.status ?? 'pending',
  };

  const { data, error } = await supabaseAdmin.from('bookings').insert(payload).select('*').single();
  if (error) throw new HttpError(400, error.message, 'BOOKING_CREATE_FAILED');
  res.status(201).json(data);
}

export async function getBookingHistory(req: Request, res: Response) {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('user_id', req.user!.id)
    .order('reservation_date', { ascending: false });

  if (error) throw new HttpError(400, error.message, 'BOOKING_HISTORY_FAILED');
  res.json(data);
}
