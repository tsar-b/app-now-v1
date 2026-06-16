import { getPath } from '../lib/objectPath.js';

const DEFAULT_APPROVED_STATUS = new Set([
  'approved',
  'confirmed',
  'active',
  '확정',
  '완료'
]);

export function filterApproved(records, collection) {
  return records.filter((record) => isApproved(record, collection.approval));
}

function isApproved(record, approval) {
  if (approval?.mode === 'all') return true;

  if (approval?.mode === 'field') {
    const actual = getPath(record, approval.field);
    return approval.values?.some((expected) => expected === actual) ?? false;
  }

  if (record.isApproved === true || record.approved === true) return true;
  if (typeof record.status === 'string') {
    return DEFAULT_APPROVED_STATUS.has(record.status.toLowerCase()) || DEFAULT_APPROVED_STATUS.has(record.status);
  }

  return false;
}
