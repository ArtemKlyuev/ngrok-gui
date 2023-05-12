import { CopyIcon } from '../../../icons';
import { copyTextToClipboard } from '../../../utils';

interface Props {
  value: string;
  hideValue?: boolean | undefined;
}

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
        <CopyIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
