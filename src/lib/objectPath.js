export function getPath(input, path) {
  if (!path) return undefined;
  return String(path)
    .split('.')
    .reduce((value, key) => {
      if (value == null) return undefined;
      return value[key];
    }, input);
}

export function mapFields(record, mapping = {}) {
  if (!mapping || Object.keys(mapping).length === 0) {
    return structuredClone(record);
  }

  const output = {};
  for (const [targetKey, sourcePath] of Object.entries(mapping)) {
    output[targetKey] = getPath(record, sourcePath);
  }
  return output;
}
