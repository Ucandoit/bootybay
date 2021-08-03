import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { configure } from 'log4js';
import { resolve } from 'path';
import { BlizzClient, BlizzClientConfig } from './blizz-client';

configure({
  appenders: {
    out: { type: 'stdout' },
  },
  categories: { default: { appenders: ['out'], level: 'info' } },
  disableClustering: true,
});

const update = async () => {
  const config = load(readFileSync(resolve(__dirname, `config/application.yaml`), 'utf-8')) as BlizzClientConfig;
  const blizzClient = new BlizzClient(config);
  await blizzClient.updateRealms();
};

update();
