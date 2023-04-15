import { FC } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const Collapse: FC<Props> = ({ title, children }) => {
  return (
    <div className="collapse">
      <input type="checkbox" className="peer" />
      <div className="collapse-title link pl-0 pr-0">{title}</div>
      <div className="collapse-content text-primary-content">
        <div className="form-control gap-4">{children}</div>
      </div>
    </div>
  );
};
