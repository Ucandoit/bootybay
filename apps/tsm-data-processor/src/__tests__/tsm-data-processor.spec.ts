import axios from 'axios';
import * as fs from 'fs';
import { join } from 'path';
import FileParser from '../file-parser';
import TsmDataProcessor from '../tsm-data-processor';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TsmDataProcessor', () => {
  const fileParser = new FileParser();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('process', () => {
    test('it should throw error if the root folder is not found.', () => {
      const processor = new TsmDataProcessor(
        {
          rootFolder: join(__dirname, 'notFound'),
          auctionHistoryUrl: 'http://localhost:9000',
          archiveFolder: '',
        },
        fileParser
      );
      expect(async () => {
        await processor.process();
      }).rejects.toThrowError();
    });

    test('it should process files in the root folder', async () => {
      const processor = new TsmDataProcessor(
        {
          rootFolder: join(__dirname, 'samples/good'),
          auctionHistoryUrl: 'http://localhost:9000',
          archiveFolder: '',
        },
        fileParser
      );
      const auctionsMock = [
        {
          itemString: '43',
          realm: 'bcc-eu-mograine-horde',
          regionHistorical: 0,
          regionMarketValue: 200000,
          regionSale: 200000,
          regionSalePercent: NaN,
          regionSoldPerDay: 0,
          timestamp: 1639038664,
        },
      ];
      const fileParserSpy = jest.spyOn(fileParser, 'parse');
      fileParserSpy.mockImplementation(() => auctionsMock);
      const fsRenameSpy = jest.spyOn(fs, 'renameSync');
      fsRenameSpy.mockImplementation(() => jest.fn());
      await processor.process();
      expect(fileParserSpy).toBeCalledTimes(2);
      expect(mockedAxios.post).toBeCalledTimes(2);
      expect(mockedAxios.post.mock.calls[0][0]).toBe('http://localhost:9000');
      expect(mockedAxios.post.mock.calls[0][1]).toBe(auctionsMock);
      expect(fsRenameSpy).toBeCalledTimes(2);
    });

    test('it should continue to process other files if an error is raised for a file', async () => {
      const processor = new TsmDataProcessor(
        {
          rootFolder: join(__dirname, 'samples/good'),
          auctionHistoryUrl: 'http://localhost:9000',
          archiveFolder: '',
        },
        fileParser
      );
      const auctionsMock = [
        {
          itemString: '43',
          realm: 'bcc-eu-mograine-horde',
          regionHistorical: 0,
          regionMarketValue: 200000,
          regionSale: 200000,
          regionSalePercent: NaN,
          regionSoldPerDay: 0,
          timestamp: 1639038664,
        },
      ];
      const fileParserSpy = jest.spyOn(fileParser, 'parse');
      fileParserSpy.mockImplementationOnce(() => {
        throw new Error();
      });
      fileParserSpy.mockImplementationOnce(() => auctionsMock);
      const fsRenameSpy = jest.spyOn(fs, 'renameSync');
      fsRenameSpy.mockImplementation(() => jest.fn());
      await processor.process();
      expect(fileParserSpy).toBeCalledTimes(2);
      expect(mockedAxios.post).toBeCalledTimes(1);
      expect(mockedAxios.post.mock.calls[0][0]).toBe('http://localhost:9000');
      expect(mockedAxios.post.mock.calls[0][1]).toBe(auctionsMock);
      expect(fsRenameSpy).toBeCalledTimes(1);
    });
  });
});
