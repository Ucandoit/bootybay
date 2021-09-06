import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { RealtimeAuctionRepository } from '../../realtime/realtime-auction.repository';
import { HistoricalAuctionRepository } from '../historical-auction.repository';
import { HistoricalAuctionService } from '../historical-auction.service';
import { historicalRegionalAuctionsStub, historicalRegionalAuctionStub } from './stubs/historical-auction.stub';

describe('HistoricalAuctionService', () => {
  let service: HistoricalAuctionService;
  let historicalRepository: HistoricalAuctionRepository;
  let realtimeRepository: RealtimeAuctionRepository;
  const session = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        HistoricalAuctionService,
        {
          provide: HistoricalAuctionRepository,
          useValue: {
            createMany: jest.fn(),
          },
        },
        {
          provide: RealtimeAuctionRepository,
          useValue: {
            createMany: jest.fn(),
          },
        },
        {
          provide: getConnectionToken('Database'),
          useValue: {
            startSession: jest.fn().mockImplementation(() => session),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<HistoricalAuctionService>(HistoricalAuctionService);
    historicalRepository = moduleRef.get<HistoricalAuctionRepository>(HistoricalAuctionRepository);
    realtimeRepository = moduleRef.get<RealtimeAuctionRepository>(RealtimeAuctionRepository);
  });

  describe('createAuction', () => {
    test('it should call createMany of both repositories when passed with an array.', async () => {
      await service.createAuctions(historicalRegionalAuctionsStub());
      expect(historicalRepository.createMany).toBeCalledWith(
        historicalRegionalAuctionsStub().map((auction) => expect.objectContaining(auction))
      );
      expect(realtimeRepository.createMany).toBeCalledWith(
        historicalRegionalAuctionsStub().map((auction) => expect.objectContaining(auction))
      );
    });

    test('it should call createMany of both repositories when passed with an object.', async () => {
      await service.createAuctions([historicalRegionalAuctionStub()]);
      expect(historicalRepository.createMany).toBeCalledWith([
        expect.objectContaining(historicalRegionalAuctionStub()),
      ]);
      expect(realtimeRepository.createMany).toBeCalledWith([expect.objectContaining(historicalRegionalAuctionStub())]);
    });

    test('it should throw error if error occurs when creating objects.', async () => {
      jest.spyOn(realtimeRepository, 'createMany').mockRejectedValue(new Error());
      await expect(async () => {
        await service.createAuctions([historicalRegionalAuctionStub()]);
      }).rejects.toThrowError('DB_ERROR');
    });
  });
});
