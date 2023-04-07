interface Props {
  children: React.ReactNode;
}

export const FieldError: React.FC<Props> = ({ children }) => {
  return <span className="label-text-alt text-error">{children}</span>;
};
