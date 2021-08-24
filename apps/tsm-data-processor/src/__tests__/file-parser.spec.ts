import { join } from 'path';
import FileParser from '../file-parser';

describe('FileParser', () => {
  describe('parse', () => {
    const fileParser = new FileParser();
    test('it should throw error if the file is not fould', () => {
      expect(() => {
        fileParser.parse(join(__dirname, 'samples/bad'), 'bcc-eu-0123456789');
      }).toThrowError();
    });

    test('it should throw error if file name has incorrect syntax', () => {
      expect(() => {
        fileParser.parse(join(__dirname, 'samples/bad'), 'bcc-eu.txt');
      }).toThrowError('File name syntax error');
    });

    test('it should throw error if timestamp is not in file name', () => {
      expect(() => {
        fileParser.parse(join(__dirname, 'samples/bad'), 'bcc-eu-test.txt');
      }).toThrowError('Parse download time error');
    });

    test('it should throw error if data is not present in the file', () => {
      expect(() => {
        fileParser.parse(join(__dirname, 'samples/bad/'), 'bcc-eu-1639008718.txt');
      }).toThrowError('Data not found');
    });

    test('it should return a list if file is read correctly', () => {
      const regionalAuctions = fileParser.parse(join(__dirname, 'samples/good'), 'bcc-eu-1639008717.txt');
      expect(regionalAuctions).toMatchSnapshot();
      const realmAuctions = fileParser.parse(join(__dirname, 'samples/good'), 'bcc-eu-mograine-horde-1639038664.txt');
      expect(realmAuctions).toMatchSnapshot();
    });

    test('it should throw error if data format is not correct in the file', () => {
      expect(() => {
        fileParser.parse(join(__dirname, 'samples/bad/'), 'bcc-eu-1639008719.txt');
      }).toThrowError('Data format incorrect');
    });
  });
});
