export function parseTimestamp(timestamp: string): Date {
  if (/Z$|[+-]\d{2}:\d{2}$/.test(timestamp)) {
    return new Date(timestamp);
  }

  return new Date(`${timestamp}Z`);
}
