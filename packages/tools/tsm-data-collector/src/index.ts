import { configure, getLogger } from 'log4js';
import { scheduleJob } from 'node-schedule';
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
const lastModified: any = {};
const job = () => {
  tsmServer
    .getStatus()
    .then((res) => {
      res.data['regions-BCC']?.forEach(async (region) => {
        if (region.downloadUrl) {
          if (lastModified[region.name] === region.lastModified) {
            logger.info('Already downloaded.');
          } else {
            logger.info('Download for region %s', region.name);
            await downloadFile(region.downloadUrl, `./${region.name}-${region.lastModified}.txt`);
            lastModified[region.name] = region.lastModified;
          }
        }
      });

      res.data['realms-BCC']?.forEach(async (realm) => {
        if (realm.downloadUrl) {
          if (lastModified[realm.name] === realm.lastModified) {
            logger.info('Already downloaded.');
          } else {
            logger.info('Download for realm %s', realm.name);
            await downloadFile(realm.downloadUrl, `./${realm.name}-${realm.lastModified}.txt`);
            lastModified[realm.name] = realm.lastModified;
          }
        }
      });
    })
    .catch((err) => {
      logger.error(err);
    });
};

scheduleJob('*/10 * * * *', job);
