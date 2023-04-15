import { FC } from 'react';

interface Props {
  children: React.ReactNode;
}

export const TunnelCard: FC<Props> & {
  Bg: typeof Bg;
  Img: typeof Img;
  Body: typeof Body;
  Title: typeof Title;
  Actions: typeof Actions;
  Action: typeof Action;
} = ({ children }) => {
  return <section className="card w-96 overflow-hidden">{children}</section>;
};

const Bg: FC<Props> = ({ children }) => {
  return <div className="bg-neutral text-neutral-content shadow-xl">{children}</div>;
};

const Img: FC<Props> = ({ children }) => {
  return <figure className="px-10 pt-10">{children}</figure>;
};

const Body: FC<Props> = ({ children }) => {
  return <div className="card-body items-center text-center">{children}</div>;
};

const Title: FC<Props> = ({ children }) => {
  return <h2 className="card-title block">{children}</h2>;
};

const Actions: FC<Props> = ({ children }) => {
  return <div className="card-actions justify-end">{children}</div>;
};

const Action: FC<Props & { onClick: () => void }> = ({ children, onClick }) => {
  return (
    <button type="button" onClick={onClick} className="btn btn-primary">
      {children}
    </button>
  );
};

TunnelCard.Bg = Bg;
TunnelCard.Img = Img;
TunnelCard.Body = Body;
TunnelCard.Title = Title;
TunnelCard.Actions = Actions;
TunnelCard.Action = Action;
