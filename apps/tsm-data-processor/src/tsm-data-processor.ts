// import axios from 'axios';
import { readdirSync, renameSync } from 'fs';
import { getLogger } from 'log4js';
import { join } from 'path';
import FileParser from './file-parser';

export interface TsmDataProcessorConfig {
  rootFolder: string;
  auctionHistoryUrl: string;
  archiveFolder: string;
}

export default class TsmDataProcessor {
  private logger = getLogger(TsmDataProcessor.name);

  constructor(private config: TsmDataProcessorConfig, private fileParser: FileParser) {}

  async process() {
    this.logger.info('Start processing.');
    const files = readdirSync(this.config.rootFolder);
    for await (const file of files) {
      try {
        this.fileParser.parse(this.config.rootFolder, file);
        this.logger.info('Saving auctions from file %s.', file);
        // await axios.post(this.config.auctionHistoryUrl, auctions);
        this.logger.info('Move file %s to archive folder.', file);
        renameSync(join(this.config.rootFolder, file), join(this.config.archiveFolder, file));
      } catch (err) {
        this.logger.error('Processing error.', err);
      }
    }
    this.logger.info('Finish processing.');
  }
}
