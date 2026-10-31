import { useEffect, useState } from 'react';
import { settings as defaultSettings } from '../data/mock';

// Tiny localStorage layer. The admin panel writes here while there is no
// backend, and the public site reads from here, so admin changes show live.
export const readStore = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
export const writeStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked */
  }
};
export function useLocalStore(key, initial) {
  const [value, setValue] = useState(() => readStore(key, initial));
  useEffect(() => { writeStore(key, value); }, [key, value]);
  return [value, setValue];
}
export const useSettings = () => ({ ...defaultSettings, ...readStore('admin:settings', {}) });
