import type { Meta, StoryObj } from '@storybook/react';

import { useTabs } from './hooks';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Dynamic: Story = {
  render: () => {
    const TABS = ['Tab 1', 'Tab 2', 'Tab 3'] as const;
    const { getTabProps, getPanelProps, getPanelsProps } = useTabs({
      tabsIDs: TABS,
      defaultSelectedTab: 'Tab 2',
    });

    return (
      <Tabs>
        <Tabs.List>
          {TABS.map((tab) => (
            <Tabs.Tab key={tab} {...getTabProps({ id: tab })}>
              {tab}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panels {...getPanelsProps()}>
          <Tabs.Panel {...getPanelProps({ id: 'Tab 1' })}>
            <div className="p-3">
              <div>Content 1</div>
              <div>Content 1</div>
              <div>Content 1</div>
              <div>Content 1</div>
            </div>
          </Tabs.Panel>
          <Tabs.Panel {...getPanelProps({ id: 'Tab 2' })}>
            <div className="p-3">
              <div>Content 2</div>
              <div>Content 2</div>
              <div>Content 2</div>
              <div>Content 2</div>
            </div>
          </Tabs.Panel>
          <Tabs.Panel {...getPanelProps({ id: 'Tab 3' })}>
            <div className="p-3">
              <div>Content 3</div>
              <div>Content 3</div>
              <div>Content 3</div>
              <div>Content 3</div>
            </div>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
  },
};
