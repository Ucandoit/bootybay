import { Test, TestingModule } from '@nestjs/testing';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';

describe('AuctionsController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AuctionsController],
      providers: [AuctionsService],
    }).compile();
  });

  describe('getAuctions', () => {
    it('should return "Welcome to auction-history!"', () => {
      const auctionsController = app.get<AuctionsController>(AuctionsController);
      expect(auctionsController.getAuctions()).toEqual({ message: 'Welcome to auction-history!' });
    });
  });
});
