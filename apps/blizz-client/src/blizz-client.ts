import axios from 'axios';
import * as FormData from 'form-data';
import * as https from 'https';
import { getLogger } from 'log4js';

axios.defaults.timeout = 30000;
axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });

const propsToIgnore = ['_links', 'preview_item', 'media:key', 'item_class:key', 'item_subclass:key'];

export interface BlizzClientConfig {
  clientId: string;
  clientSecret: string;
  host: string;
  accessTokenUrl: string;
  blizzDataServer: string;
  auctionHistoryServer: string;
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

  async updateItems() {
    const accessToken = await this.getAccessToken();
    const itemIds = await this.getItemIds();
    console.log(itemIds);
    const resItemIds = await axios.get(`${this.config.blizzDataServer}/items/distinct`, {
      validateStatus: () => true,
    });
    if (resItemIds.status !== 200) {
      this.logger.error('Error while getting distinct item ids.');
      return;
    }
    for await (const itemId of itemIds) {
      if (resItemIds.data.includes(itemId)) {
        this.logger.info('Item %d already created.', itemId);
        continue;
      }
      this.logger.info('Requesting item %d', itemId);
      const res = await axios.get(`${this.config.host}/data/wow/item/${itemId}`, {
        params: {
          namespace: 'static-classic-eu',
          locale: 'en_US',
          access_token: accessToken,
        },
        validateStatus: () => true,
      });
      this.logger.info('Requested item %d', itemId);
      if (res.status === 200) {
        for (const prop of propsToIgnore) {
          const propSplit = prop.split(':');
          if (propSplit.length === 1) {
            Reflect.deleteProperty(res.data, prop);
          } else {
            Reflect.deleteProperty(res.data[propSplit[0]], propSplit[1]);
          }
        }
        this.logger.info('Updating item %d', itemId);
        try {
          await axios.post(`${this.config.blizzDataServer}/items`, res.data);
        } catch (err) {
          this.logger.info('Error updating item %d', itemId);
        }
        this.logger.info('Updated item %d', itemId);
      } else {
        this.logger.error('Error while getting access token. Status: %s, message: %j', res.status, res.data);
      }
    }
  }

  async getItemIds(): Promise<number[]> {
    const res = await axios.get(`${this.config.auctionHistoryServer}/historical/distinct`, {
      validateStatus: () => true,
    });
    if (res.status === 200) {
      return res.data.map((itemString: string) => parseInt(itemString, 10));
    } else {
      this.logger.error('Error while getting distinct item ids.');
      return [];
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
