import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { RealmAuction, RegionalAuction } from '../dto/auction.dto';
import { RealtimeAuctionRepository } from '../realtime/realtime-auction.repository';
import { HistoricalAuctionRepository } from './historical-auction.repository';

@Injectable()
export class HistoricalAuctionService {
  private readonly logger = new Logger(HistoricalAuctionService.name);
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly historicalAuctionRepository: HistoricalAuctionRepository,
    private readonly realtimeAuctionRepository: RealtimeAuctionRepository
  ) {}

  async createAuctions(createAuctionsDto: Array<RegionalAuction | RealmAuction>): Promise<void> {
    const createEntities = createAuctionsDto.map((dto: RegionalAuction | RealmAuction) => ({
      ...dto,
      // custom _id field
      _id: `${dto.itemString}-${dto.realm}-${dto.timestamp}`,
    }));

    const transactionSession = await this.connection.startSession();

    try {
      transactionSession.startTransaction();
      await this.historicalAuctionRepository.createMany(createEntities);
      await this.realtimeAuctionRepository.createMany(createEntities);
      await transactionSession.commitTransaction();
    } catch (err) {
      this.logger.error('Error while creating auction documents.', err);
      await transactionSession.abortTransaction();
      throw new InternalServerErrorException('DB_ERROR', 'Error while creating auction documents.');
    } finally {
      await transactionSession.endSession();
    }
  }

  /**
   * Get Auction histories after a given timestamp, filtered by realm and itemString
   */
  getAuctionHistories(
    itemString: string,
    realm: string,
    timestamp: number
  ): Promise<Array<RealmAuction | RegionalAuction>> {
    return this.historicalAuctionRepository.find(
      {
        itemString,
        realm,
        timestamp: {
          $gt: timestamp,
        },
      },
      { timestamp: 1 }
    );
  }

  getDistinctItemString() {
    return this.historicalAuctionRepository.getDistinctItemString();
  }
}
