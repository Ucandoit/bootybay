import { Test } from '@nestjs/testing';
import { HistoricalAuctionController } from '../historical-auction.controller';
import { HistoricalAuctionService } from '../historical-auction.service';
import { historicalRegionalAuctionStub } from './stubs/historical-auction.stub';

describe('HistoricalAuctionController', () => {
  let controller: HistoricalAuctionController;
  let service: HistoricalAuctionService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HistoricalAuctionController],
      providers: [
        {
          provide: HistoricalAuctionService,
          useValue: {
            createAuctions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<HistoricalAuctionController>(HistoricalAuctionController);
    service = moduleRef.get<HistoricalAuctionService>(HistoricalAuctionService);
    jest.clearAllMocks();
  });

  describe('createAuction', () => {
    it('should call auctionService', () => {
      controller.createAuctions([historicalRegionalAuctionStub()]);
      expect(service.createAuctions).toBeCalledWith([historicalRegionalAuctionStub()]);
    });
  });
});
