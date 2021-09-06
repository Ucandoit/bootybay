import { Injectable } from '@nestjs/common';
import { RealtimeAuctionRepository } from './realtime-auction.repository';
import { RealtimeAuctionsRequestDto, RealtimeAuctionsResponseDto } from './realtime-auctions.dto';

@Injectable()
export class RealtimeAuctionService {
  constructor(private readonly auctionRepository: RealtimeAuctionRepository) {}
  async getAuctionByRealm({
    realm,
    page = 0,
    size = 10,
  }: RealtimeAuctionsRequestDto): Promise<RealtimeAuctionsResponseDto> {
    const total = await this.auctionRepository.countMostRecentByRealm(realm);
    const auctions = await this.auctionRepository.findMostRecentByRealm(realm, page, size);
    return {
      page,
      size,
      total,
      auctions,
    };
  }

  async deleteOutDatedRealtimeAuctionsByRealm(realm: string): Promise<void> {
    const latest = await this.auctionRepository.find({ realm }, { timestamp: -1 }, 1);
    if (latest.length > 0) {
      await this.auctionRepository.deleteMany({ realm, timestamp: { $lt: latest[0].timestamp } });
    }
  }
}
