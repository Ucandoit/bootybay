import { Item } from '@bootybay/common-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class BlizzardService {
  private readonly logger = new Logger(BlizzardService.name);

  private readonly blizzDataUrl: string;

  constructor(private configService: ConfigService) {
    this.blizzDataUrl = this.configService.get<string>('blizzData.url');
  }

  async getItems(ids: string[]): Promise<Item[]> {
    try {
      this.logger.debug(`Calling GET /items of blizz-data`);
      const response = await axios.get(`${this.blizzDataUrl}/items?ids=${ids.join(',')}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      this.logger.warn(`Error while calling GET /items of blizz-data.`);
      this.logger.warn(err);
      return [];
    }
  }
}
