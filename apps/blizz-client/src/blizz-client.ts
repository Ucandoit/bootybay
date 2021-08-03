import axios from 'axios';
import * as FormData from 'form-data';
import { getLogger } from 'log4js';

export interface BlizzClientConfig {
  clientId: string;
  clientSecret: string;
  host: string;
  accessTokenUrl: string;
  blizzDataServer: string;
}
export class BlizzClient {
  private logger = getLogger(BlizzClient.name);

  constructor(private config: BlizzClientConfig) {}

  async updateRealms() {
    const accessToken = await this.getAccessToken();
    const res = await axios.get(`${this.config.host}/data/wow/realm/index`, {
      params: {
        namespace: 'dynamic-classic-eu',
        locale: 'en_US',
        access_token: accessToken,
      },
    });
    if (res.status === 200) {
      const realms = res.data.realms.map((realm) => ({
        id: realm.id,
        slug: realm.slug,
        name: realm.name,
        region: 'bcc-eu',
      }));
      await axios.post(`${this.config.blizzDataServer}/realms`, realms);
    } else {
      this.logger.error('Error while updating realm. Status: %s, message: %j', res.status, res.data);
      throw new Error('Blizz data error');
    }
  }

  async getAccessToken(): Promise<string> {
    const formData = new FormData();
    formData.append('grant_type', 'client_credentials');
    const res = await axios.post(this.config.accessTokenUrl, formData, {
      auth: {
        username: this.config.clientId,
        password: this.config.clientSecret,
      },
      headers: formData.getHeaders(),
      validateStatus: () => true,
    });
    if (res.status === 200) {
      this.logger.debug('Get access token OK.');
      return res.data.access_token;
    }
    this.logger.error('Error while getting access token. Status: %s, message: %j', res.status, res.data);
    throw new Error('Access token error');
  }
}
