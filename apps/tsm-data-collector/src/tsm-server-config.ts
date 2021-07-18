export interface TsmServerConfig {
  account: {
    login: string;
    password: string;
  };
  encrypt: {
    passwordSalt: string;
    tokenSalt: string;
  };
  metadata: {
    version: string;
  };
  url: string;
}
