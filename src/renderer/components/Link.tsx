import { FC } from 'react';

interface Props {
  URL: string;
  children: React.ReactNode;
}

export const ExternalLink: FC<Props> = ({ URL, children }) => {
  return (
    <a href={URL} target="_blank" className="link">
      {children}
    </a>
  );
};
