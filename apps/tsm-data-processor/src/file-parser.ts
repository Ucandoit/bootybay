import { readFileSync } from 'fs';
import { getLogger } from 'log4js';
import { join } from 'path';
import { RealmAuction, RegionalAuction } from './auction';

export default class FileParser {
  private logger = getLogger(FileParser.name);
  parse(folder: string, filename: string): Array<RealmAuction | RegionalAuction> {
    this.logger.info('Start parsing file %s.', filename);

    const [realm, timestamp] = this.parseFilename(filename);

    const data = readFileSync(join(folder, filename), { encoding: 'utf-8' });

    const [, dataString] = data.split('data=');
    if (!dataString) {
      this.logger.error('Data not found in the file.');
      throw new Error('Data not found');
    }
    const auctions: Array<RealmAuction | RegionalAuction> = [];
    for (let section of dataString.split('},{')) {
      // remove '{' and '}' from section
      section = section.replace(/({|})/g, '');
      const fields = section.split(',');
      auctions.push({
        itemString: fields[0],
        realm,
        timestamp,
        regionMarketValue: parseInt(fields[1], 10),
        regionHistorical: parseInt(fields[2], 10),
        regionSale: parseInt(fields[3], 10),
        regionSoldPerDay: parseInt(fields[4], 10),
        regionSalePercent: parseInt(fields[5], 10),
      });
    }

    this.logger.info('Finish parsing file %s.', filename);
    return auctions;
  }

  private parseFilename(filePath: string): [string, number] {
    const filename = filePath.split('/').pop().split('.').shift().toLowerCase();
    const sections = filename.split('-');
    if (sections.length < 3) {
      this.logger.error('File name syntax incorrect.');
      throw new Error('File name syntax error');
    }
    const timeString = sections.pop();
    if (!timeString.match(/^\d+$/g)) {
      this.logger.error('Parse download time error.');
      throw new Error('Parse download time error');
    }
    return [sections.join('-'), +timeString];
  }
}
