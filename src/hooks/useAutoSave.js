import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useAutoSave hook
 * - Debounces save ~5s after typing stops
 * - Concurrency control: queues or skips in-flight saves, preventing duplicate drafts
 * - Indicators: "idle" | "unsaved" | "saving" | "saved" | "error"
 * - Disables automatically when enabled=false (e.g. for published or scheduled posts)
 * - Sets beforeunload listener when there are unsaved changes
 */
export function useAutoSave({
  onSave,
  data,
  isDirty = false,
  enabled = true,
  debounceMs = 5000,
}) {
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'unsaved' | 'saving' | 'saved' | 'error'
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [error, setError] = useState(null);

  const isSavingRef = useRef(false);
  const queuedDataRef = useRef(null);
  const timerRef = useRef(null);
  const retryTimerRef = useRef(null);
  const latestDataRef = useRef(data);
  latestDataRef.current = data;

  const performSave = useCallback(
    async (payload) => {
      if (!enabled) return;
      if (isSavingRef.current) {
        queuedDataRef.current = payload;
        return;
      }

      isSavingRef.current = true;
      setSaveStatus('saving');
      setError(null);

      try {
        await onSave(payload);
        setSaveStatus('saved');
        setLastSavedAt(new Date());
        setError(null);

        // Process any queued payload that arrived while saving
        if (queuedDataRef.current) {
          const nextPayload = queuedDataRef.current;
          queuedDataRef.current = null;
          isSavingRef.current = false;
          await performSave(nextPayload);
          return;
        }
      } catch (err) {
        setSaveStatus('error');
        setError(err?.message || 'Save failed');
        // Backoff retry after 3 seconds if still dirty
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        retryTimerRef.current = setTimeout(() => {
          performSave(latestDataRef.current);
        }, 3000);
      } finally {
        isSavingRef.current = false;
      }
    },
    [enabled, onSave]
  );

  // Trigger debounce whenever data/isDirty changes while enabled
  useEffect(() => {
    if (!enabled || !isDirty) {
      if (!isDirty && saveStatus === 'unsaved') {
        setSaveStatus('idle');
      }
      return;
    }

    setSaveStatus((prev) => (prev === 'saving' ? 'saving' : 'unsaved'));

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      performSave(latestDataRef.current);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, isDirty, enabled, debounceMs, performSave]);

  // Window beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty && (saveStatus === 'unsaved' || saveStatus === 'error')) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, [isDirty, saveStatus]);

  const saveNow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    return performSave(latestDataRef.current);
  }, [performSave]);

  return {
    saveStatus,
    setSaveStatus,
    lastSavedAt,
    error,
    saveNow,
  };
}
