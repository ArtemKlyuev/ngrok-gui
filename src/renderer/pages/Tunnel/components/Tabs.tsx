import { useTabs, Tabs, QRCode } from '../../../components';

import { AuthValue } from './AuthValue';
import { TunnelCard } from './Card';
import { Collapse } from './Collapse';
import { StandardCard } from './StandardCard';

const TABS = ['With auth', 'Without auth'] as const;

interface Props {
  name: string;
  URLWithAuth: string;
  URLWithoutAuth: string;
  auth: { login: string; password: string };
}

export const TunnelTabs = ({
  name,
  auth,
  URLWithAuth,
  URLWithoutAuth,
}: Props): React.ReactElement => {
  const { getTabProps, getPanelProps, getPanelsProps } = useTabs({
    tabsIDs: TABS,
    defaultSelectedTab: 'With auth',
  });

  const handleOpenInBrowser = (URL: string) => (): void => {
    window.open(URL);
  };

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
        <Tabs.Panel {...getPanelProps({ id: 'With auth' })}>
          <StandardCard name={name} URL={URLWithAuth} />
        </Tabs.Panel>
        <Tabs.Panel {...getPanelProps({ id: 'Without auth' })}>
          <TunnelCard>
            <TunnelCard.Img>
              <QRCode text={URLWithoutAuth} />
            </TunnelCard.Img>
            <TunnelCard.Body>
              <TunnelCard.Title>
                Tunnel with name <span className="italic">{name}</span> started!
              </TunnelCard.Title>
              <p>Scan QR code to connect</p>
              <div className="divider">OR</div>
              <TunnelCard.Actions>
                <TunnelCard.Action onClick={handleOpenInBrowser(URLWithoutAuth)}>
                  Open in browser
                </TunnelCard.Action>
              </TunnelCard.Actions>
              <Collapse title="Show credentials">
                <AuthValue value={auth.login} />
                <AuthValue value={auth.password} hideValue />
              </Collapse>
            </TunnelCard.Body>
          </TunnelCard>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};
