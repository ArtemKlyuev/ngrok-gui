type NgrokProtocol = 'http' | 'tcp' | 'tls';

interface NgrokBasicAuth {
  login: string;
  password: string;
}

interface NgrokOptions {
  name: string;
  proto: NgrokProtocol;
  port: number;
  binPath: string;
  auth?: NgrokBasicAuth | undefined;
}
