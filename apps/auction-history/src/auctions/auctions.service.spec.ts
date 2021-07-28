import { Test } from '@nestjs/testing';
import { AuctionsService } from './auctions.service';

describe('AuctionsService', () => {
  let service: AuctionsService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AuctionsService],
    }).compile();

    service = app.get<AuctionsService>(AuctionsService);
  });

  describe('getData', () => {
    it('should return "Welcome to auction-history!"', () => {
      expect(service.getAuctions()).toEqual({ message: 'Welcome to auction-history!' });
    });
  });
});
