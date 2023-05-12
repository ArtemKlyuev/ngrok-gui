import { useEffect, useState } from 'react';

import { copyTextToClipboard } from '../utils';

export const useCopyToClipboard = ({ resetTimeout = 2000 } = {}) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timerID: number;

    if (isCopied) {
      timerID = window.setTimeout(() => {
        setIsCopied(false);
      }, resetTimeout);
    }

    return () => {
      clearTimeout(timerID);
    };
  }, [isCopied]);

  const copyToClipboard = async (text: string): Promise<void> => {
    await copyTextToClipboard(text);
    setIsCopied(true);
  };

  return { isCopied, copyToClipboard };
};
