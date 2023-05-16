# Ngrok GUI

Unofficial [`ngrok`](https://ngrok.com/) GUI client for `macOs`(tested on `ARM` chip only)

> This project is for my personal needs, but if you are interested, feel free to use it for non-commercial purposes.

![Start tunnel page](/docs/start_tunnel.png 'Start tunnel')

## Features

- Start `http` tunnel with or without basic auth.
- Page with a running tunnel and the necessary elements to interact with it.

### Start tunnel

The ability to start a `http` tunnel with or without basic auth. You can choose `ngrok`
binary installed in `PATH` or provide custom path.

![Start tunnel page](/docs/start_tunnel.png 'Start tunnel')

### Tunnel page

When you open a tunnel, the appropriate page will be available to you with necessary elements
to interact with tunnel:

- QR code with tunnel URL
- `Open in browser` button
- `Copy link` button
- `Stop tunnel` button

If you chose to open tunnel with auth, then 2 tabs will be available on this page: `With
auth` and `Without auth`. On the first tab QR code and buttons will have a URL with embedded authorization, on
the second url will be without auth and additional `Show credentials` section will be available.

![Tunnel page](/docs/tunnel.png 'Tunnel')

TODO:

- error handling all exceptions
- logger
- tray icon
- notifications
  - system
  - inside app
- save app config (https://github.com/electron/electron/issues/526)
