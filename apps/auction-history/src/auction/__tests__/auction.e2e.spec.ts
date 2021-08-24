import { INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';
import * as request from 'supertest';
import { AuctionModule } from '../auction.module';
import { Auction, AuctionDocument } from '../schema/auction.schema';
import { auctionsStub, auctionStub, realAuctionsStub, realAuctionStub } from './stubs/auction.stub';

describe('Auction e2e tests', () => {
  let app: INestApplication;
  let memoryMongodb: MongoMemoryServer;
  let model: Model<AuctionDocument>;
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AuctionModule,
        MongooseModule.forRootAsync({
          useFactory: async () => {
            memoryMongodb = await MongoMemoryServer.create();
            const mongoUri = await memoryMongodb.getUri();
            return {
              uri: mongoUri,
            };
          },
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    connection = moduleRef.get(getConnectionToken());
    model = moduleRef.get<Model<AuctionDocument>>(getModelToken(Auction.name));
    await app.init();
  });

  beforeEach(async () => {
    await model.deleteMany({});
  });

  describe('POST /', () => {
    describe('request with invalid request body', () => {
      const testCases = [
        {
          description: 'should return 400 if body is empty',
          body: {},
          status: 400,
        },
        {
          description: 'should return 400 if required itemId is missing',
          body: {
            realm: 'bcc-eu-regional',
            timestamp: 1627580614000,
          },
          status: 400,
        },
        {
          description: 'should return 400 if required realm is missing',
          body: {
            itemString: '1',
            timestamp: 1627580614000,
          },
          status: 400,
        },
        {
          description: 'should return 400 if required timestamp is missing',
          body: {
            itemString: '1',
            realm: 'bcc-eu-regional',
          },
          status: 400,
        },
        {
          description: 'should return 400 if itemId is not a string',
          body: {
            itemString: 1,
            realm: 'bcc-eu-regional',
            timestamp: 1627580614000,
          },
          status: 400,
        },
        {
          description: 'should return 400 if realm is not a string',
          body: {
            itemString: '1',
            realm: 123,
            timestamp: 1627580614000,
          },
          status: 400,
        },
        {
          description: 'should return 400 if timestamp is not a number',
          body: {
            itemString: '1',
            realm: 'bcc-eu-regional',
            timestamp: 'test',
          },
          status: 400,
        },
        {
          description: 'should return 400 if regionMarketValue is not a number',
          body: {
            itemString: '1',
            realm: 'bcc-eu-regional',
            timestamp: 'test',
            regionMarketValue: 'test',
          },
          status: 400,
        },
        {
          description: 'should return 400 if regionHistorical is not a number',
          body: {
            itemString: '1',
            realm: 'bcc-eu-regional',
            timestamp: 'test',
            regionHistorical: 'test',
          },
          status: 400,
        },
        {
          description: 'should return 400 if regionSale is not a number',
          body: {
            itemString: '1',
            realm: 'bcc-eu-regional',
            timestamp: 'test',
            regionSale: 'test',
          },
          status: 400,
        },
        {
          description: 'should return 400 if regionSoldPerDay is not a number',
          body: {
            itemString: '1',
            realm: 'bcc-eu-regional',
            timestamp: 'test',
            regionSoldPerDay: 'test',
          },
          status: 400,
        },
        {
          description: 'should return 400 if regionSalePercent is not a number',
          body: {
            itemString: '1',
            realm: 'bcc-eu-regional',
            timestamp: 'test',
            regionSalePercent: 'test',
          },
          status: 400,
        },
        {
          description: 'should return 400 if marketValue is not a number',
          body: {
            itemString: '1',
            realm: 'bcc-eu-regional',
            timestamp: 'test',
            marketValue: 'test',
          },
          status: 400,
        },
        {
          description: 'should return 400 if minBuyout is not a number',
          body: {
            itemString: '1',
            realm: 'bcc-eu-regional',
            timestamp: 'test',
            minBuyout: 'test',
          },
          status: 400,
        },
        {
          description: 'should return 400 if historical is not a number',
          body: {
            itemString: '1',
            realm: 'bcc-eu-regional',
            timestamp: 'test',
            historical: 'test',
          },
          status: 400,
        },
        {
          description: 'should return 400 if numAuctions is not a number',
          body: {
            itemString: '1',
            realm: 'bcc-eu-regional',
            timestamp: 'test',
            numAuctions: 'test',
          },
          status: 400,
        },
      ];

      testCases.forEach(({ description, body, status }) => {
        test(description, async () => {
          const res = await request(app.getHttpServer()).post('/').send(body).expect(status);
          expect(res.body).toMatchSnapshot();
        });
      });
    });
  });

  describe('request with valid request body', () => {
    test('should return 201 with regional auction', async () => {
      await request(app.getHttpServer()).post('/').send(auctionStub()).expect(201);
      const documents = await model.find({});
      expect(documents).toHaveLength(1);
      expect(documents[0]).toMatchSnapshot();
    });

    test('should return 201 with realm auction', async () => {
      await request(app.getHttpServer()).post('/').send(realAuctionStub()).expect(201);
      const documents = await model.find({});
      expect(documents).toHaveLength(1);
      expect(documents[0]).toMatchSnapshot();
    });

    test('should return 201 with regional auction array', async () => {
      await request(app.getHttpServer()).post('/').send(auctionsStub()).expect(201);
      const documents = await model.find({});
      expect(documents).toHaveLength(2);
      expect(documents).toMatchSnapshot();
    });

    test('should return 201 with realm auction array', async () => {
      await request(app.getHttpServer()).post('/').send(realAuctionsStub()).expect(201);
      const documents = await model.find({});
      expect(documents).toHaveLength(2);
      expect(documents).toMatchSnapshot();
    });

    test('unknown properties should be ignored', async () => {
      await request(app.getHttpServer())
        .post('/')
        .send({
          ...auctionStub(),
          unknown: 'unknown',
        })
        .expect(201);
      const documents = await model.find({});
      expect(documents).toHaveLength(1);
      expect(documents[0]).toMatchSnapshot();
      expect(Reflect.hasOwnMetadata('unknown', documents[0])).toBe(false);
    });

    test('should return 500 if auction history already exists', async () => {
      await request(app.getHttpServer()).post('/').send(auctionStub()).expect(201);
      await request(app.getHttpServer()).post('/').send(auctionStub()).expect(500);
      // check that only one record is added
      const documents = await model.find({});
      expect(documents).toHaveLength(1);
      expect(documents[0]).toMatchSnapshot();
    });
  });

  afterAll(async () => {
    await connection.close();
    await memoryMongodb.stop();
    await app.close();
  });
});
