import { useCallback, useEffect, useState } from 'react';

/**
 * a react hook for async function that has return value
 * @param asyncFunction the async function to call
 * @param defaultValue default state of the return value
 * @param params parameters of the async function call
 * @returns an object containing the return value, state of the call (pending or not) and error
 */
export const useAsyncFunction = <T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asyncFunction: (...args: any[]) => Promise<T>,
  defaultValue: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...params: any[]
): {
  value: T;
  isPending: boolean;
  error: string | null;
} => {
  const [state, setState] = useState({
    value: defaultValue,
    isPending: true,
    error: null,
  });

  const callFunction = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPending: true,
    }));
    asyncFunction(...params)
      .then((val) => setState({ value: val, isPending: false, error: null }))
      .catch((err) =>
        setState({
          value: defaultValue,
          isPending: false,
          error: err.toString(),
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFunction, defaultValue, JSON.stringify(params)]);

  useEffect(() => {
    callFunction();
  }, [callFunction]);

  return state;
};

export default useAsyncFunction;
