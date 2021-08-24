import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';
import { AuctionRepository } from '../auction.repository';
import { Auction, AuctionDocument, AuctionSchema } from '../schema/auction.schema';
import { auctionsStub, auctionStub } from './stubs/auction.stub';

describe('AuctionRepository', () => {
  let memoryMongodb: MongoMemoryServer;
  let repository: AuctionRepository;
  let model: Model<AuctionDocument>;
  let connection: Connection;

  beforeAll(async () => {
    memoryMongodb = await MongoMemoryServer.create();
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
        MongooseModule.forRootAsync({
          useFactory: async () => {
            const mongoUri = await memoryMongodb.getUri();
            return {
              uri: mongoUri,
            };
          },
        }),
      ],
      providers: [AuctionRepository],
    }).compile();

    repository = moduleRef.get<AuctionRepository>(AuctionRepository);
    model = moduleRef.get<Model<AuctionDocument>>(getModelToken(Auction.name));
    connection = moduleRef.get(getConnectionToken());
    await model.deleteMany({});
  });

  describe('create', () => {
    describe('create a valid document', () => {
      let res: AuctionDocument;
      beforeEach(async () => {
        res = await repository.create({
          ...auctionStub(),
          _id: 'test',
        });
      });

      test('result should have _id property', () => {
        expect(res._id).not.toBeNull();
        expect(res._id).not.toBeUndefined();
      });

      test('result should match stub', () => {
        expect(res).toMatchObject(auctionStub());
      });

      test('collection should have the created document', async () => {
        const documents = await model.find({});
        expect(documents).toHaveLength(1);
        expect(documents[0]).toMatchObject(auctionStub());
      });
    });

    describe('create a document without required properties', () => {
      test('it should throw an error', () => {
        expect(async () => {
          await repository.create({});
        }).rejects.toThrowError();
      });
    });

    describe('create two same documents', () => {
      test('the second should throw an error', async () => {
        const document = {
          ...auctionStub(),
          _id: 'test',
        };
        await repository.create(document);
        expect(async () => {
          await repository.create(document);
        }).rejects.toThrowError();
      });
    });
  });

  describe('createMany', () => {
    describe('create some valid documents', () => {
      let res: AuctionDocument[];
      beforeEach(async () => {
        res = await repository.createMany(
          auctionsStub().map((auction) => ({
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
        expect(res).toMatchObject(auctionsStub());
      });

      test('collection should have the created documents', async () => {
        const documents = await model.find({});
        expect(documents).toHaveLength(2);
        expect(documents).toMatchObject(auctionsStub());
      });
    });

    describe('create documents without required properties', () => {
      test('it should throw an error', () => {
        expect(async () => {
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
