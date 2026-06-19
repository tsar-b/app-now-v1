import type { Request, Response } from 'express';
import { HttpError } from '../../core/errors';
import { supabaseAdmin } from '../../db/supabaseAdmin';

export async function initializeCatalog(_req: Request, res: Response) {
  const [subtypes, options, pricings, assets, timeSlots, serviceTypes] = await Promise.all([
    readTable('subtypes'),
    readTable('options'),
    readTable('pricings'),
    readTable('assets'),
    readTable('timeslots'),
    readTable('servicetypes')
  ]);

  res.json({
    subtypes,
    options,
    pricings,
    assets,
    timeSlots,
    serviceTypes
  });
}

async function readTable(table: string) {
  const { data, error } = await supabaseAdmin.from(table).select('*');
  if (error) throw new HttpError(400, error.message, 'CATALOG_READ_FAILED');
  return data ?? [];
}
