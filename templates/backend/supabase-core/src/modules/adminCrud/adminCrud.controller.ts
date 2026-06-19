import type { Request, Response } from 'express';
import { HttpError } from '../../core/errors.js';
import { supabaseAdmin } from '../../db/supabaseAdmin.js';

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
  const table = assertTable(paramValue(req.params.table));
  const { data, error } = await supabaseAdmin.from(table).select('*').limit(500);
  if (error) throw new HttpError(400, error.message, 'ADMIN_LIST_FAILED');
  res.json(data);
}

export async function updateRow(req: Request, res: Response) {
  const table = assertTable(paramValue(req.params.table));
  const rowId = paramValue(req.params.id);
  const { data, error } = await supabaseAdmin
    .from(table)
    .update(req.body)
    .eq('id', rowId)
    .select('*')
    .single();

  if (error) throw new HttpError(400, error.message, 'ADMIN_UPDATE_FAILED');
  res.json(data);
}

export async function deleteRow(req: Request, res: Response) {
  const table = assertTable(paramValue(req.params.table));
  const rowId = paramValue(req.params.id);
  const { error } = await supabaseAdmin.from(table).delete().eq('id', rowId);
  if (error) throw new HttpError(400, error.message, 'ADMIN_DELETE_FAILED');
  res.json({ ok: true });
}

function assertTable(table: string) {
  if (!ALLOWED_TABLES.has(table)) {
    throw new HttpError(404, 'Unknown admin table', 'UNKNOWN_TABLE');
  }
  return table;
}

function paramValue(value: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}
