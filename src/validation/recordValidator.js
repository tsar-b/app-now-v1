export function validateTransformedRecords(collection, records) {
  const requiredFields = collection.requiredFields ?? [];
  if (requiredFields.length === 0) {
    return { ok: true, errors: [] };
  }

  const errors = [];
  records.forEach((record, index) => {
    for (const field of requiredFields) {
      const value = record[field];
      if (value === undefined || value === null || value === '') {
        errors.push({
          collection: collection.name,
          index,
          field,
          message: `${collection.name}[${index}] is missing required field ${field}`
        });
      }
    }
  });

  return { ok: errors.length === 0, errors };
}

export function assertValidTransformedRecords(collection, records) {
  const result = validateTransformedRecords(collection, records);
  if (result.ok) return;

  const preview = result.errors
    .slice(0, 10)
    .map((error) => `- ${error.message}`)
    .join('\n');

  const suffix = result.errors.length > 10
    ? `\n...and ${result.errors.length - 10} more validation errors.`
    : '';

  throw new Error(`Validation failed before upload/export for ${collection.name}:\n${preview}${suffix}`);
}
