import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';
import { RealtimeAuctionRepository } from '../realtime-auction.repository';
import { RealtimeAuction, RealtimeAuctionDocument, RealtimeAuctionSchema } from '../realtime-auction.schema';
import { realtimeAuctionsStub } from './stubs/realtime-auction.stub';

describe('RealtimeAuctionRepository', () => {
  let memoryMongodb: MongoMemoryServer;
  let repository: RealtimeAuctionRepository;
  let model: Model<RealtimeAuctionDocument>;
  let connection: Connection;

  beforeAll(async () => {
    memoryMongodb = await MongoMemoryServer.create();
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: RealtimeAuction.name, schema: RealtimeAuctionSchema }]),
        MongooseModule.forRootAsync({
          useFactory: async () => {
            const mongoUri = await memoryMongodb.getUri();
            return {
              uri: mongoUri,
            };
          },
        }),
      ],
      providers: [RealtimeAuctionRepository],
    }).compile();

    repository = moduleRef.get<RealtimeAuctionRepository>(RealtimeAuctionRepository);
    model = moduleRef.get<Model<RealtimeAuctionDocument>>(getModelToken(RealtimeAuction.name));
    connection = moduleRef.get(getConnectionToken());
    await model.deleteMany({});
  });

  describe('createMany', () => {
    describe('create some valid documents', () => {
      let res: RealtimeAuctionDocument[];
      beforeEach(async () => {
        res = await repository.createMany(
          realtimeAuctionsStub().map((auction) => ({
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

      test('result should match stub', () => {
        expect(res).toMatchObject(realtimeAuctionsStub());
      });

      test('collection should have the created documents', async () => {
        const documents = await model.find({});
        expect(documents).toHaveLength(2);
        expect(documents).toMatchObject(realtimeAuctionsStub());
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

  describe('deleteMany', () => {
    describe('delete some documentsd', () => {
      beforeEach(async () => {
        // prepare data to delete
        await model.insertMany(
          realtimeAuctionsStub().map((auction) => ({
            ...auction,
            _id: `${auction.itemString}-${auction.realm}-${auction.regionHistorical}`,
          }))
        );
      });

      test('it should be deleted', async () => {
        await repository.deleteMany({ itemString: { $in: ['1'] } });
        const deleted = await model.find({ itemString: '1' });
        expect(deleted).toHaveLength(0);
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
