import { FC } from 'react';
import cn from 'classnames';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'error';
  size: 'small' | 'medium';
}

const sizeToClassName = {
  small: 'btn-sm',
  medium: 'btn-md',
};

const variantToClassName = {
  primary: 'btn-primary',
  error: 'btn-error',
};

export const Button: FC<Props> = ({ variant, size, type = 'button', ...props }) => {
  return (
    <button
      type={type}
      className={cn('btn', sizeToClassName[size], variantToClassName[variant])}
      {...props}
    />
  );
};
