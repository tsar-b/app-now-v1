import type { Request, Response } from 'express';
import { HttpError } from '../../core/errors';
import { supabaseAdmin } from '../../db/supabaseAdmin';

const ALLOWED_TABLES = new Set([
  'users',
  'bookings',
  'assets',
  'categories',
  'options',
  'pricings',
  'servicetypes',
  'subtypes',
  'timeslots'
]);

export async function listRows(req: Request, res: Response) {
  const table = assertTable(req.params.table);
  const { data, error } = await supabaseAdmin.from(table).select('*').limit(500);
  if (error) throw new HttpError(400, error.message, 'ADMIN_LIST_FAILED');
  res.json(data);
}

export async function updateRow(req: Request, res: Response) {
  const table = assertTable(req.params.table);
  const { data, error } = await supabaseAdmin
    .from(table)
    .update(req.body)
    .eq('id', req.params.id)
    .select('*')
    .single();

  if (error) throw new HttpError(400, error.message, 'ADMIN_UPDATE_FAILED');
  res.json(data);
}

export async function deleteRow(req: Request, res: Response) {
  const table = assertTable(req.params.table);
  const { error } = await supabaseAdmin.from(table).delete().eq('id', req.params.id);
  if (error) throw new HttpError(400, error.message, 'ADMIN_DELETE_FAILED');
  res.json({ ok: true });
}

function assertTable(table: string) {
  if (!ALLOWED_TABLES.has(table)) {
    throw new HttpError(404, 'Unknown admin table', 'UNKNOWN_TABLE');
  }
  return table;
}
