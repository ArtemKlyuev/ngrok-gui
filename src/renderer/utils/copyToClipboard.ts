const fallbackCopyTextToClipboard = (text: string): void => {
  const textArea = document.createElement('textarea');
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.visibility = 'none';

  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (e) {
    console.error('fallback copy to clipboard fail', e);
  }

  document.body.removeChild(textArea);
};

export const copyTextToClipboard = async (text: string): Promise<void> => {
  /**
   * @see https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
   */
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    fallbackCopyTextToClipboard(text);
  }
};
