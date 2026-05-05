/**
 * Escapes a value for CSV output, handling commas, quotes, and newlines.
 */
export const escapeCsvValue = (val: any): string => {
  const str = String(val === null || val === undefined ? '' : val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};
