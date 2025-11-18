export function convertNumberToCol(col: number): string {
  const ordA = 'a'.charCodeAt(0);
  const ordZ = 'z'.charCodeAt(0);
  const len = ordZ - ordA + 1;

  let s = '';
  while (col >= 0) {
    s = String.fromCharCode((col % len) + ordA) + s;
    col = Math.floor(col / len) - 1;
  }
  return s.toUpperCase();
}

export function convertColToNumber(col: string): number {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let i,
    j,
    result = 0;

  for (i = 0, j = col.length - 1; i < col.length; i += 1, j -= 1) {
    result += Math.pow(base.length, j) * (base.indexOf(col[i]) + 1);
  }

  return result - 1;
}
