import axios from 'axios';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { configure, getLogger } from 'log4js';
import { format } from 'util';
import { encrypt } from './encrypt';
import { TsmServerConfig } from './TsmServerConfig';

const TSM_SERVER_URL = 'http://%s.tradeskillmaster.com/v2/%s';

configure({
  appenders: {
    out: { type: 'stdout' }
  },
  categories: { default: { appenders: ['out'], level: 'info' } },
  disableClustering: true
});

const logger = getLogger('tsm-data-collector');
const tsmConfig: TsmServerConfig = load(readFileSync(`config/application-dev.yml`, 'utf-8')) as TsmServerConfig;
logger.debug(tsmConfig);
// init server
const loginUrl = format(
  TSM_SERVER_URL,
  'app-server',
  `login/${encrypt(tsmConfig.account.login.toLowerCase())}/${encrypt(
    `${encrypt(tsmConfig.account.password, 'sha512')}${tsmConfig.encrypt.passwordSalt}`,
    'sha512'
  )}`
);
logger.info(loginUrl);
const timestamp = Math.floor(Date.now() / 1000);
const params = {
  session: '',
  version: tsmConfig.metadata.version,
  time: timestamp,
  token: encrypt(`${tsmConfig.metadata.version}:${timestamp}:${tsmConfig.encrypt.tokenSalt}`)
};
logger.info(params);
axios
  .get(loginUrl, {
    params
  })
  .then((res) => {
    logger.info(res.data);
  })
  .catch((err) => {
    logger.error(err);
  });

// login

// collect data

// save to folder
