import { CopyIcon } from '../../../icons';

interface Props {
  value: string;
  hideValue?: boolean | undefined;
}

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
  } catch (e) {
    fallbackCopyTextToClipboard(text);
  }
};

export const AuthValue = ({ value, hideValue = false }: Props) => {
  const type = hideValue ? 'password' : 'text';
  const visibleValue = hideValue ? '******' : value;

  const handleCopy = () => copyTextToClipboard(value);

  return (
    <div className="input-group">
      <input
        type={type}
        disabled
        defaultValue={visibleValue}
        className="input input-sm input-bordered"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="btn btn-sm btn-square btn-active btn-ghost"
      >
        <CopyIcon />
      </button>
    </div>
  );
};
