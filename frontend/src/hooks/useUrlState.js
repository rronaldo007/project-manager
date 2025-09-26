import { useState, useEffect } from 'react';

export const useUrlState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(key);
    if (value !== null) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return initialValue;
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (state !== initialValue) {
      urlParams.set(key, typeof state === 'string' ? state : JSON.stringify(state));
    } else {
      urlParams.delete(key);
    }
    
    const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, [state, key, initialValue]);

  return [state, setState];
};
