import { Test } from '@nestjs/testing';
import { AuctionRepository } from '../auction.repository';
import { AuctionService } from '../auction.service';
import { auctionsStub, auctionStub } from './stubs/auction.stub';

describe('AuctionService', () => {
  let service: AuctionService;
  let repository: AuctionRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuctionService,
        {
          provide: AuctionRepository,
          useValue: {
            create: jest.fn(),
            createMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<AuctionService>(AuctionService);
    repository = moduleRef.get<AuctionRepository>(AuctionRepository);
  });

  describe('createAuction', () => {
    it('should call createMany when passed with an array.', () => {
      service.createAuction(auctionsStub());
      expect(repository.createMany).toBeCalledWith(auctionsStub().map((auction) => expect.objectContaining(auction)));
    });

    it('should call create when passed with an object.', () => {
      service.createAuction(auctionStub());
      expect(repository.create).toBeCalledWith(expect.objectContaining(auctionStub()));
    });
  });
});
