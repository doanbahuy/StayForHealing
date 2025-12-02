import * as crypto from 'crypto';
export const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const isNullOrEmpty = (value: any) => {
  if (value === undefined) return false;
  return value === '' || value === null;
};

// Hàm hash object filter thành một chuỗi duy nhất
export const hashFilter = (prefix = 'customer', filter: any): string => {
  const filterString = JSON.stringify(filter); // Chuyển object thành string
  const hash = crypto.createHash('sha256').update(filterString).digest('hex'); // Tạo SHA-256 hash

  return `${prefix}_${hash}`;
};
