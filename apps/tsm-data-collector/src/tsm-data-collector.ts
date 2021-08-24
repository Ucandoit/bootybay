import axios, { AxiosResponse } from 'axios';
import { createWriteStream } from 'fs';
import { getLogger } from 'log4js';
import { resolve } from 'path';
import { finished } from 'stream';
import { promisify } from 'util';
import { Realm, Region, StatusResponse } from './status-response';
import TsmServer from './tsm-server';
export class TsmDataCollector {
  private logger = getLogger(TsmDataCollector.name);
  private lastModified: { [key: string]: number } = {};

  constructor(private server: TsmServer, private downloadFolder: string) {}

  async collect() {
    try {
      const response: AxiosResponse<StatusResponse> = await this.server.getStatus();
      response.data['regions-BCC']?.forEach(async (region) => {
        await this.download(region);
      });

      response.data['realms-BCC']?.forEach(async (realm) => {
        await this.download(realm);
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async download(source: Region | Realm): Promise<void> {
    if (source.downloadUrl) {
      if (this.lastModified[source.name] === source.lastModified) {
        this.logger.info('Already downloaded.');
      } else {
        this.logger.info('Download for %s', source.name);
        const name = source.name.toLowerCase().startsWith('bcc-eu')
          ? source.name.toLowerCase()
          : `bcc-eu-${source.name.toLowerCase()}`;
        const finishedPromise = promisify(finished);
        const writer = createWriteStream(
          resolve(__dirname, `${this.downloadFolder}/${name}-${source.lastModified}.txt`)
        );
        const response = await axios.get(source.downloadUrl, {
          responseType: 'stream',
        });
        response.data.pipe(writer);
        await finishedPromise(writer);

        this.lastModified[source.name] = source.lastModified;
      }
    }
  }
}
