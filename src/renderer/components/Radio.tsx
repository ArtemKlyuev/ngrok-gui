import { ChangeEvent, forwardRef } from 'react';

interface Props {
  checked?: boolean;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, Props>(({ label, ...props }, ref) => {
  return (
    <div className="form-control">
      <label className="label justify-start gap-[15px] cursor-pointer">
        <input ref={ref} type="radio" className="radio radio-sm radio-accent" {...props} />
        <span className="label-text">{label}</span>
      </label>
    </div>
  );
});
