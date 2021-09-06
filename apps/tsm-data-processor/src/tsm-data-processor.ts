// import axios from 'axios';
import axios from 'axios';
import { readdirSync, renameSync } from 'fs';
import { getLogger } from 'log4js';
import { join } from 'path';
import { RealmAuction, RegionalAuction } from './auction';
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
      // only process text files
      if (file.endsWith('.txt')) {
        try {
          const auctions = this.fileParser.parse(this.config.rootFolder, file);
          this.logger.info('Saving auctions from file %s.', file);
          // send auctions by chunks of 20
          const auctionChunks = auctions.reduce((chunks: (RealmAuction | RegionalAuction)[][], auction, index) => {
            if (index % 20 === 0) {
              chunks.push([]);
            }
            chunks[chunks.length - 1].push(auction);
            return chunks;
          }, []);
          for await (const auctionChunk of auctionChunks) {
            await axios.post(`${this.config.auctionHistoryUrl}/historical`, auctionChunk);
          }
          await axios.delete(`${this.config.auctionHistoryUrl}/realtime/outdated?realm=${auctions[0].realm}`);
          this.logger.info('Move file %s to archive folder.', file);
          renameSync(join(this.config.rootFolder, file), join(this.config.archiveFolder, file));
        } catch (err) {
          this.logger.error('Processing error.', err);
        }
      }
    }
    this.logger.info('Finish processing.');
  }
}
