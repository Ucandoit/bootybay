import { Injectable } from '@nestjs/common';
import { AuctionRepository } from './auction.repository';
import { CreateAuctionDto, RealmAuction, RegionalAuction } from './dto/auction.dto';

@Injectable()
export class AuctionService {
  constructor(private readonly auctionRepository: AuctionRepository) {}

  async createAuction(createAuctionDto: CreateAuctionDto): Promise<void> {
    if (Array.isArray(createAuctionDto)) {
      await this.auctionRepository.createMany(
        createAuctionDto.map((dto: RegionalAuction | RealmAuction) => ({
          ...dto,
          _id: `${dto.itemId}-${dto.realm}-${dto.timestamp}`,
        }))
      );
    } else {
      await this.auctionRepository.create({
        ...createAuctionDto,
        _id: `${createAuctionDto.itemId}-${createAuctionDto.realm}-${createAuctionDto.timestamp}`,
      });
    }
  }
}
