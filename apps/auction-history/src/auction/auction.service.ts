import { Injectable } from '@nestjs/common';
import { AuctionRepository } from './auction.repository';
import { CreateAuctionDto, RealmAuction, RegionalAuction } from './dto/auction.dto';
import { RecentAuctionsRequestDto, RecentAuctionsResponseDto } from './dto/recent-auctions.dto';

@Injectable()
export class AuctionService {
  constructor(private readonly auctionRepository: AuctionRepository) {}

  async createAuction(createAuctionDto: CreateAuctionDto): Promise<void> {
    if (Array.isArray(createAuctionDto)) {
      await this.auctionRepository.createMany(
        createAuctionDto.map((dto: RegionalAuction | RealmAuction) => ({
          ...dto,
          _id: `${dto.itemString}-${dto.realm}-${dto.timestamp}`,
        }))
      );
    } else {
      await this.auctionRepository.create({
        ...createAuctionDto,
        _id: `${createAuctionDto.itemString}-${createAuctionDto.realm}-${createAuctionDto.timestamp}`,
      });
    }
  }

  async getAuctionByRealm({
    realm,
    page = 0,
    size = 10,
  }: RecentAuctionsRequestDto): Promise<RecentAuctionsResponseDto> {
    const total = await this.auctionRepository.countMostRecentByRealm(realm);
    const auctions = await this.auctionRepository.findMostRecentByRealm(realm, page, size);
    return {
      page,
      size,
      total,
      auctions,
    };
  }
}
