import { Injectable } from '@nestjs/common';
import { AuctionRepository } from './auction.repository';
import { CreateAuctionDto } from './dto/auction.dto';

@Injectable()
export class AuctionService {
  constructor(private readonly auctionRepository: AuctionRepository) {}

  async createAuction(createAuctionDto: CreateAuctionDto): Promise<void> {
    if (Array.isArray(createAuctionDto)) {
      await this.auctionRepository.createMany(createAuctionDto);
    } else {
      await this.auctionRepository.create(createAuctionDto);
    }
  }
}
