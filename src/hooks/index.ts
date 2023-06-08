import { useCallback, useEffect, useRef } from 'react';

export const useMountedState = () => {
  const mountedRef = useRef(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return get;
};

interface RafHandle {
  id: number;
}

const clearRafTimeout = (handle?: RafHandle | null) => {
  if (handle) {
    cancelAnimationFrame(handle.id);
  }
};

const setRafTimeout = (callback: () => void, timeout: number = 0) => {
  const interval = timeout < 0 ? 0 : timeout;
  const handle: RafHandle = {
    id: 0,
  };

  let startTime = Date.now();

  const loop = () => {
    if (Date.now() - startTime >= interval) {
      callback();
    } else {
      handle.id = requestAnimationFrame(loop);
    }
  };

  handle.id = requestAnimationFrame(loop);

  return handle;
};

export const useRafPolling = (fn: () => Promise<void>, timeout?: number) => {
  const timerRef = useRef<RafHandle>();
  const endedRef = useRef(false);

  const fnRef = useRef(fn);
  fnRef.current = fn;

  const end = useCallback(() => {
    endedRef.current = true;
    clearRafTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    void (async function run() {
      await fnRef.current();
      if (!endedRef.current) {
        timerRef.current = setRafTimeout(run, timeout);
      }
    })();

    return () => {
      endedRef.current = true;
      clearRafTimeout(timerRef.current);
    };
  }, [timeout]);

  return end;
};