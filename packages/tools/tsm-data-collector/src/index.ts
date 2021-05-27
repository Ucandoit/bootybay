import { configure, getLogger } from 'log4js';
import { downloadFile } from './file-downloader';
import TsmServer from './tsm-server';

configure({
  appenders: {
    out: { type: 'stdout' }
  },
  categories: { default: { appenders: ['out'], level: 'info' } },
  disableClustering: true
});

const logger = getLogger('tsm-data-collector');
const tsmServer = new TsmServer();
tsmServer
  .getStatus()
  .then((res) => {
    res.data['regions-BCC']?.forEach(async (region) => {
      if (region.downloadUrl) {
        logger.info('Download for region {}', region.name);
        await downloadFile(region.downloadUrl, `./${region.name}/${region.lastModified}.txt`);
      }
    });
  })
  .catch((err) => {
    logger.error(err);
  });
