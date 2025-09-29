import { useEffect, useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  // Para evitar hydration mismatches, no leemos localStorage durante el render inicial.
  const [value, setValue] = useState(initialValue);

  // Rehidratar desde localStorage tras el montaje.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) {
        setValue(JSON.parse(raw));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Sincronizar cambios hacia localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}
