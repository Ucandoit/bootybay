import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';
import { HistoricalAuctionRepository } from '../historical-auction.repository';
import { HistoricalAuction, HistoricalAuctionDocument, HistoricalAuctionSchema } from '../historical-auction.schema';
import { historicalRegionalAuctionsStub } from './stubs/historical-auction.stub';

describe('HistoricalAuctionRepository', () => {
  let memoryMongodb: MongoMemoryServer;
  let repository: HistoricalAuctionRepository;
  let model: Model<HistoricalAuctionDocument>;
  let connection: Connection;

  beforeAll(async () => {
    memoryMongodb = await MongoMemoryServer.create();
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: HistoricalAuction.name, schema: HistoricalAuctionSchema }]),
        MongooseModule.forRootAsync({
          useFactory: async () => {
            const mongoUri = await memoryMongodb.getUri();
            return {
              uri: mongoUri,
            };
          },
        }),
      ],
      providers: [HistoricalAuctionRepository],
    }).compile();

    repository = moduleRef.get<HistoricalAuctionRepository>(HistoricalAuctionRepository);
    model = moduleRef.get<Model<HistoricalAuctionDocument>>(getModelToken(HistoricalAuction.name));
    connection = moduleRef.get(getConnectionToken());
    await model.deleteMany({});
  });

  describe('createMany', () => {
    describe('create some valid documents', () => {
      let res: HistoricalAuctionDocument[];
      beforeEach(async () => {
        res = await repository.createMany(
          historicalRegionalAuctionsStub().map((auction) => ({
            ...auction,
            _id: `${auction.itemString}-${auction.realm}-${auction.regionHistorical}`,
          }))
        );
      });

      test('result should be an array', () => {
        expect(Array.isArray(res)).toBe(true);
        expect(res).toHaveLength(2);
      });

      test('each result document should have _id property', () => {
        for (const document of res) {
          expect(document._id).not.toBeNull();
          expect(document._id).not.toBeUndefined();
        }
      });

      test('result should match stubs', () => {
        expect(res).toMatchObject(historicalRegionalAuctionsStub());
      });

      test('collection should have the created documents', async () => {
        const documents = await model.find({});
        expect(documents).toHaveLength(2);
        expect(documents).toMatchObject(historicalRegionalAuctionsStub());
      });
    });

    describe('create documents without required properties', () => {
      test('it should throw an error', async () => {
        await expect(async () => {
          await repository.createMany([{}]);
        }).rejects.toThrowError();
      });
    });
  });

  afterEach(async () => {
    await connection.close();
  });

  afterAll(async () => {
    await memoryMongodb.stop();
  });
});
