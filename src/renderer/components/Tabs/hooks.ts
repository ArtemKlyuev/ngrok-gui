import { useState } from 'react';

interface Props<Tabs extends readonly string[]> {
  tabsIDs: Tabs;
  defaultSelectedTab?: Tabs[number] | undefined;
}

const isSelected = (id: string, index: number, selectedTab: string | number): boolean => {
  if (typeof selectedTab === 'number') {
    return index === selectedTab;
  }

  return id === selectedTab;
};

const getInitialState = <const Tabs extends readonly string[]>(
  tabsIDs: Tabs,
  defaultSelectedTab: Tabs[number],
) => {
  return tabsIDs.map((id, i) => ({ id, selected: isSelected(id, i, defaultSelectedTab) }));
};

export const useTabs = <const Tabs extends readonly string[]>({
  tabsIDs,
  defaultSelectedTab = tabsIDs[0],
}: Props<Tabs>) => {
  const [tabs, setSelectedTabs] = useState(() => getInitialState(tabsIDs, defaultSelectedTab));

  const selectTab = (tab: Tabs[number] | number): void => {
    const newTabs = tabs.map((data, i) => {
      if (isSelected(data.id, i, tab)) {
        data.selected = true;
      } else {
        data.selected = false;
      }

      return data;
    });

    setSelectedTabs(newTabs);
  };

  const getTabProps = ({
    id,
    onSelect: onUserSelect,
  }: {
    id: Tabs[number];
    onSelect?: () => void | undefined;
  }) => {
    const { selected } = tabs.find((data) => data.id === id)!;

    const onSelect = (): void => {
      selectTab(id);
      onUserSelect?.();
    };

    return { selected, onSelect };
  };

  const getPanelsProps = () => {
    const selectedTabIndex = tabs.findIndex((data) => data.selected)!;

    return { selectedTabIndex };
  };

  const getPanelProps = ({ id }: { id: Tabs[number] }) => {
    const { selected: visible } = tabs.find((data) => data.id === id)!;

    return { visible };
  };

  return { selectTab, getTabProps, getPanelsProps, getPanelProps };
};
