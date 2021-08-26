import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { configure } from 'log4js';
import { scheduleJob } from 'node-schedule';
import { resolve } from 'path';
import { TsmDataCollectorConfig } from './config';
import { TsmDataCollector } from './tsm-data-collector';
import TsmServer from './tsm-server';

configure({
  appenders: {
    out: { type: 'stdout' },
  },
  categories: { default: { appenders: ['out'], level: 'info' } },
  disableClustering: true,
});

const config = load(readFileSync(resolve(__dirname, `config/application.yaml`), 'utf-8')) as TsmDataCollectorConfig;
const tsmDataCollector = new TsmDataCollector(new TsmServer(config.tsmServer), config.downloadFolder);

const job = async () => {
  await tsmDataCollector.collect();
};

scheduleJob('*/10 * * * *', job);
