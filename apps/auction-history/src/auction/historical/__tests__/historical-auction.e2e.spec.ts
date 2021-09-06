import { INestApplication } from '@nestjs/common';
import { getConnectionToken, getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';
import * as request from 'supertest';
import { RealtimeAuctionRepository } from '../../realtime/realtime-auction.repository';
import {
  RealtimeAuction,
  RealtimeAuctionDocument,
  RealtimeAuctionSchema,
} from '../../realtime/realtime-auction.schema';
import { HistoricalAuctionController } from '../historical-auction.controller';
import { HistoricalAuctionRepository } from '../historical-auction.repository';
import { HistoricalAuction, HistoricalAuctionDocument, HistoricalAuctionSchema } from '../historical-auction.schema';
import { HistoricalAuctionService } from '../historical-auction.service';
import { historicalRegionalAuctionStub, realtimeRegionalAuctionStub } from './stubs/historical-auction.stub';

describe('Auction e2e tests', () => {
  let app: INestApplication;
  let memoryMongodb: MongoMemoryServer;
  let historicalAuctionModel: Model<HistoricalAuctionDocument>;
  let realtimeAuctionModel: Model<RealtimeAuctionDocument>;
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: HistoricalAuction.name, schema: HistoricalAuctionSchema },
          { name: RealtimeAuction.name, schema: RealtimeAuctionSchema },
        ]),
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
      controllers: [HistoricalAuctionController],
      providers: [HistoricalAuctionService, HistoricalAuctionRepository, RealtimeAuctionRepository],
    }).compile();

    app = moduleRef.createNestApplication();
    connection = moduleRef.get(getConnectionToken());
    historicalAuctionModel = moduleRef.get<Model<HistoricalAuctionDocument>>(getModelToken(HistoricalAuction.name));
    realtimeAuctionModel = moduleRef.get<Model<RealtimeAuctionDocument>>(getModelToken(RealtimeAuction.name));
    await app.init();
  });

  beforeEach(async () => {
    await historicalAuctionModel.deleteMany({});
    await realtimeAuctionModel.deleteMany({});
  });

  describe('POST /historical', () => {
    describe('request with invalid request body', () => {
      const testCases = [
        {
          description: 'should return 400 if body is not an array',
          body: {},
          status: 400,
        },
        {
          description: 'should return 400 if body is an empty array',
          body: [],
          status: 400,
        },
        {
          description: 'should return 400 if required itemId is missing',
          body: [
            {
              realm: 'bcc-eu-regional',
              timestamp: 1627580614000,
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if required realm is missing',
          body: [
            {
              itemString: '1',
              timestamp: 1627580614000,
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if required timestamp is missing',
          body: [
            {
              itemString: '1',
              realm: 'bcc-eu-regional',
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if itemId is not a string',
          body: [
            {
              itemString: 1,
              realm: 'bcc-eu-regional',
              timestamp: 1627580614000,
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if realm is not a string',
          body: [
            {
              itemString: '1',
              realm: 123,
              timestamp: 1627580614000,
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if timestamp is not a number',
          body: [
            {
              itemString: '1',
              realm: 'bcc-eu-regional',
              timestamp: 'test',
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if regionMarketValue is not a number',
          body: [
            {
              itemString: '1',
              realm: 'bcc-eu-regional',
              timestamp: 'test',
              regionMarketValue: 'test',
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if regionHistorical is not a number',
          body: [
            {
              itemString: '1',
              realm: 'bcc-eu-regional',
              timestamp: 'test',
              regionHistorical: 'test',
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if regionSale is not a number',
          body: [
            {
              itemString: '1',
              realm: 'bcc-eu-regional',
              timestamp: 'test',
              regionSale: 'test',
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if regionSoldPerDay is not a number',
          body: [
            {
              itemString: '1',
              realm: 'bcc-eu-regional',
              timestamp: 'test',
              regionSoldPerDay: 'test',
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if regionSalePercent is not a number',
          body: [
            {
              itemString: '1',
              realm: 'bcc-eu-regional',
              timestamp: 'test',
              regionSalePercent: 'test',
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if marketValue is not a number',
          body: [
            {
              itemString: '1',
              realm: 'bcc-eu-regional',
              timestamp: 'test',
              marketValue: 'test',
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if minBuyout is not a number',
          body: [
            {
              itemString: '1',
              realm: 'bcc-eu-regional',
              timestamp: 'test',
              minBuyout: 'test',
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if historical is not a number',
          body: [
            {
              itemString: '1',
              realm: 'bcc-eu-regional',
              timestamp: 'test',
              historical: 'test',
            },
          ],
          status: 400,
        },
        {
          description: 'should return 400 if numAuctions is not a number',
          body: [
            {
              itemString: '1',
              realm: 'bcc-eu-regional',
              timestamp: 'test',
              numAuctions: 'test',
            },
          ],
          status: 400,
        },
      ];

      testCases.forEach(({ description, body, status }) => {
        test(description, async () => {
          const res = await request(app.getHttpServer()).post('/historical').send(body).expect(status);
          expect(res.body).toMatchSnapshot();
        });
      });
    });
  });

  describe('request with valid request body', () => {
    test('should return 201 with regional auction array', async () => {
      await request(app.getHttpServer()).post('/historical').send([historicalRegionalAuctionStub()]).expect(201);
      const historicalAuctionDocuments = await historicalAuctionModel.find({});
      expect(historicalAuctionDocuments).toHaveLength(1);
      expect(historicalAuctionDocuments[0]).toMatchSnapshot();
      const realtimeAuctionDocuments = await realtimeAuctionModel.find({});
      expect(realtimeAuctionDocuments).toHaveLength(1);
      expect(realtimeAuctionDocuments[0]).toMatchSnapshot();
    });

    test('should return 201 with realm auction array', async () => {
      await request(app.getHttpServer()).post('/historical').send([realtimeRegionalAuctionStub()]).expect(201);
      const historicalAuctionDocuments = await historicalAuctionModel.find({});
      expect(historicalAuctionDocuments).toHaveLength(1);
      expect(historicalAuctionDocuments[0]).toMatchSnapshot();
      const realtimeAuctionDocuments = await realtimeAuctionModel.find({});
      expect(realtimeAuctionDocuments).toHaveLength(1);
      expect(realtimeAuctionDocuments[0]).toMatchSnapshot();
    });

    test('unknown properties should be ignored', async () => {
      await request(app.getHttpServer())
        .post('/historical')
        .send([
          {
            ...historicalRegionalAuctionStub(),
            unknown: 'unknown',
          },
        ])
        .expect(201);
      const documents = await historicalAuctionModel.find({});
      expect(documents).toHaveLength(1);
      expect(documents[0]).toMatchSnapshot();
      expect(Reflect.hasOwnMetadata('unknown', documents[0])).toBe(false);
    });

    test('should return 500 if auction history already exists', async () => {
      await request(app.getHttpServer()).post('/historical').send([historicalRegionalAuctionStub()]).expect(201);
      await request(app.getHttpServer()).post('/historical').send([historicalRegionalAuctionStub()]).expect(500);
      // check that only one record is added
      const documents = await historicalAuctionModel.find({});
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
