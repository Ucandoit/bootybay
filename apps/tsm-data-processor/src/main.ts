import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { configure } from 'log4js';
import { scheduleJob } from 'node-schedule';
import { resolve } from 'path';
import FileParser from './file-parser';
import TsmDataProcessor, { TsmDataProcessorConfig } from './tsm-data-processor';

configure({
  appenders: {
    out: { type: 'stdout' },
  },
  categories: { default: { appenders: ['out'], level: 'info' } },
  disableClustering: true,
});

const job = async () => {
  const config = load(readFileSync(resolve(__dirname, `config/application.yaml`), 'utf-8')) as TsmDataProcessorConfig;
  const processor = new TsmDataProcessor(config, new FileParser());
  await processor.process();
};

scheduleJob('5 * * * *', job);
