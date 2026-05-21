import { useState, useEffect } from 'react';

const STORAGE_KEY = 'weblozy_token_usage';
const QUOTA_EXCEEDED_KEY = 'weblozy_quota_exceeded';
const LAST_CALL_KEY = 'weblozy_last_call_time';
const TOTAL_LIMIT = 50000;

const getStoredValue = (): number => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return parseInt(stored);
  }
  const initial = 0;
  localStorage.setItem(STORAGE_KEY, initial.toString());
  return initial;
};

export function useTokens() {
  const [used, setUsed] = useState<number>(getStoredValue);
  const [lastUsage, setLastUsage] = useState<number>(() => {
    const storedLast = localStorage.getItem(STORAGE_KEY + '_last');
    return storedLast ? parseInt(storedLast) : 0;
  });

  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(() => {
    return localStorage.getItem(QUOTA_EXCEEDED_KEY) === 'true';
  });

  const [lastCallTime, setLastCallTime] = useState<number>(() => {
    const storedTime = localStorage.getItem(LAST_CALL_KEY);
    return storedTime ? parseInt(storedTime) : 0;
  });

  useEffect(() => {
    const handleUpdate = () => {
      setUsed(getStoredValue());
      const storedLast = localStorage.getItem(STORAGE_KEY + '_last');
      if (storedLast) {
        setLastUsage(parseInt(storedLast));
      }
      setIsQuotaExceeded(localStorage.getItem(QUOTA_EXCEEDED_KEY) === 'true');
      const storedTime = localStorage.getItem(LAST_CALL_KEY);
      if (storedTime) {
        setLastCallTime(parseInt(storedTime));
      }
    };

    window.addEventListener('weblozy-token-update', handleUpdate);
    return () => {
      window.removeEventListener('weblozy-token-update', handleUpdate);
    };
  }, []);

  const consumeTokens = (count: number, quotaExceeded: boolean = false) => {
    const current = getStoredValue();
    // If it's a fallback, we don't consume tokens from our bucket (error calls use 0 tokens)
    const next = current + count;
    const now = Date.now();

    localStorage.setItem(STORAGE_KEY, next.toString());
    localStorage.setItem(STORAGE_KEY + '_last', count.toString());
    localStorage.setItem(QUOTA_EXCEEDED_KEY, quotaExceeded ? 'true' : 'false');
    localStorage.setItem(LAST_CALL_KEY, now.toString());
    
    setUsed(next);
    setLastUsage(count);
    setIsQuotaExceeded(quotaExceeded);
    setLastCallTime(now);
    
    // Dispatch event to sync other instances in real time
    window.dispatchEvent(new CustomEvent('weblozy-token-update'));
  };

  const setQuotaStatus = (exceeded: boolean) => {
    localStorage.setItem(QUOTA_EXCEEDED_KEY, exceeded ? 'true' : 'false');
    setIsQuotaExceeded(exceeded);
    window.dispatchEvent(new CustomEvent('weblozy-token-update'));
  };

  const remaining = TOTAL_LIMIT - used;
  const percentage = (used / TOTAL_LIMIT) * 100;

  return {
    used,
    remaining,
    total: TOTAL_LIMIT,
    percentage,
    lastUsage,
    isQuotaExceeded,
    lastCallTime,
    consumeTokens,
    setQuotaStatus
  };
}
