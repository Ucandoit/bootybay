import axios from 'axios';
import { readdirSync } from 'fs';
import { getLogger } from 'log4js';
import FileParser from './file-parser';

export interface TsmDataProcessorConfig {
  rootFolder: string;
  auctionHistoryUrl: string;
}

export default class TsmDataProcessor {
  private logger = getLogger(TsmDataProcessor.name);

  constructor(private config: TsmDataProcessorConfig, private fileParser: FileParser) {}

  async process() {
    this.logger.info('Start processing.');
    const files = readdirSync(this.config.rootFolder);
    for await (const file of files) {
      try {
        const auctions = this.fileParser.parse(this.config.rootFolder, file);
        await axios.post(this.config.auctionHistoryUrl, auctions);
      } catch (err) {
        this.logger.error('Processing error.', err);
      }
    }
    this.logger.info('Finish processing.');
  }
}
