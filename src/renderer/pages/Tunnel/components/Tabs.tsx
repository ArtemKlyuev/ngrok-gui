import { useTabs, Tabs, QRCode } from '../../../components';

import { TunnelCard } from './Card';

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
          <TunnelCard>
            <TunnelCard.Img>
              <QRCode text={URLWithAuth} />
            </TunnelCard.Img>
            <TunnelCard.Body>
              <TunnelCard.Title>
                Tunnel with name <span className="italic">{name}</span> started!
              </TunnelCard.Title>
              <p>Scan QR code to connect</p>
              <div className="divider">OR</div>
              <TunnelCard.Actions>
                <TunnelCard.Action onClick={handleOpenInBrowser(URLWithAuth)}>
                  Open in browser
                </TunnelCard.Action>
              </TunnelCard.Actions>
            </TunnelCard.Body>
          </TunnelCard>
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
              <div className="collapse">
                <input type="checkbox" className="peer" />
                <div className="collapse-title link pl-0 pr-0">Show credentials</div>
                <div className="collapse-content text-primary-content">
                  <div className="form-control gap-4">
                    <div className="input-group">
                      <input
                        type="text"
                        disabled
                        defaultValue={auth.login}
                        className="input input-sm input-bordered"
                      />
                      <button className="btn btn-sm btn-square btn-active btn-ghost">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="input-group">
                      <input
                        type="password"
                        disabled
                        defaultValue={auth.password}
                        className="input input-sm input-bordered"
                      />
                      <button className="btn btn-sm btn-square btn-active btn-ghost">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          role="img"
                          className="h-4 w-4"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                          <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TunnelCard.Body>
          </TunnelCard>
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};
