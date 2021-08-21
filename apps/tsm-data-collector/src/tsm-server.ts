import axios, { AxiosResponse } from 'axios';
import { getLogger } from 'log4js';
import { format } from 'util';
import { TsmServerConfig } from './config';
import encrypt from './encrypt';
import { LoginResponse } from './login-response';
import { StatusResponse } from './status-response';

export default class TsmServer {
  private logger = getLogger(TsmServer.name);

  constructor(private tsmConfig: TsmServerConfig) {}

  async getStatus(): Promise<AxiosResponse<StatusResponse>> {
    const res = await this.login();
    const url = format(this.tsmConfig.url, res.data.endpointSubdomains.status, 'status');
    this.logger.info(url);
    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      session: res.data.session,
      version: this.tsmConfig.metadata.version,
      time: timestamp,
      token: encrypt(`${this.tsmConfig.metadata.version}:${timestamp}:${this.tsmConfig.encrypt.tokenSalt}`),
    };
    this.logger.info(params);
    return axios.get(url, {
      params,
    });
  }

  private login(): Promise<AxiosResponse<LoginResponse>> {
    const url = format(
      this.tsmConfig.url,
      'app-server',
      `login/${encrypt(this.tsmConfig.account.login.toLowerCase())}/${encrypt(
        `${encrypt(this.tsmConfig.account.password, 'sha512')}${this.tsmConfig.encrypt.passwordSalt}`,
        'sha512'
      )}`
    );
    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      session: '',
      version: this.tsmConfig.metadata.version,
      time: timestamp,
      token: encrypt(`${this.tsmConfig.metadata.version}:${timestamp}:${this.tsmConfig.encrypt.tokenSalt}`),
    };
    this.logger.info(url, params);
    return axios.get(url, {
      params,
    });
  }
}
