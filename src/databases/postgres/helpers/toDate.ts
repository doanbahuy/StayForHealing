export function toDateOnly(date: string): string {
  if (date.includes('/')) {
    const [mm, dd, yyyy] = date.split('/');
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }
  return date;
}
