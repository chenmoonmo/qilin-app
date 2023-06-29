import { type RefObject, useEffect } from 'react';

const defaultOptions: MutationObserverInit = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};

export const useMutationObserver = <TElement extends HTMLElement>(
  ref: RefObject<TElement>,
  callback: MutationCallback,
  options: MutationObserverInit = defaultOptions
) => {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, options);
      return () => {
        observer.disconnect();
      };
    }
  }, [callback, options]);
};
