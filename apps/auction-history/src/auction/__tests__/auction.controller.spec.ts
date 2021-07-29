import { Test } from '@nestjs/testing';
import { AuctionController } from '../auction.controller';
import { AuctionService } from '../auction.service';
import { auctionStub } from './stubs/auction.stub';

describe('AuctionController', () => {
  let controller: AuctionController;
  let service: AuctionService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuctionController],
      providers: [
        {
          provide: AuctionService,
          useValue: {
            createAuction: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get<AuctionController>(AuctionController);
    service = moduleRef.get<AuctionService>(AuctionService);
    jest.clearAllMocks();
  });

  describe('createAuction', () => {
    it('should call auctionService', () => {
      controller.createAuction(auctionStub());
      expect(service.createAuction).toBeCalledWith(auctionStub());
    });
  });
});
