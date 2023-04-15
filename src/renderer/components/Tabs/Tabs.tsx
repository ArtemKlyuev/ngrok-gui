import { FC } from 'react';
import cn from 'classnames';

interface Props {
  children: React.ReactNode;
}

export const Tabs: FC<Props> & {
  List: typeof TabList;
  Tab: typeof Tab;
  Panels: typeof Panels;
  Panel: typeof Panel;
} = ({ children }) => {
  return <div>{children}</div>;
};

const TabList: FC<Props> = ({ children }) => {
  return (
    <div role="tablist" className="tabs">
      {children}
    </div>
  );
};

const Tab: FC<Props & { selected: boolean; onSelect: () => void }> = ({
  children,
  selected,
  onSelect,
}) => {
  return (
    <button
      role="tab"
      onClick={onSelect}
      className={cn('tab', 'tab-lifted', '[--tab-border-color:transparent]', {
        'tab-active': selected,
        '[--tab-bg:hsl(var(--n))]': selected,
      })}
    >
      {children}
    </button>
  );
};

const Panels: FC<Props & { selectedTabIndex: number }> = ({ children, selectedTabIndex }) => {
  return (
    <div
      className={cn('card w-96 bg-neutral text-neutral-content shadow-xl', {
        'rounded-tl-none': selectedTabIndex === 0,
      })}
    >
      {children}
    </div>
  );
};

const Panel: FC<Props & { visible: boolean }> = ({ children, visible }) => {
  if (visible) {
    return <div role="tabpanel">{children}</div>;
  }

  return null;
};

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panels = Panels;
Tabs.Panel = Panel;
