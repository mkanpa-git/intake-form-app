import { useEffect, useState } from 'react';

export default function useMediaQuery(query) {
  const getMatch = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    const m = window.matchMedia(query);
    return m ? m.matches : false;
  };

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      setMatches(false);
      return;
    }
    const mm = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    if (mm.addEventListener) {
      mm.addEventListener('change', handler);
    } else if (mm.addListener) {
      mm.addListener(handler);
    }
    setMatches(mm.matches);
    return () => {
      if (mm.removeEventListener) {
        mm.removeEventListener('change', handler);
      } else if (mm.removeListener) {
        mm.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
}
