import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HistoricalAuction,
  HistoricalAuctionController,
  HistoricalAuctionRepository,
  HistoricalAuctionSchema,
  HistoricalAuctionService,
} from './historical';
import {
  RealtimeAuction,
  RealtimeAuctionController,
  RealtimeAuctionRepository,
  RealtimeAuctionSchema,
  RealtimeAuctionService,
} from './realtime';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistoricalAuction.name, schema: HistoricalAuctionSchema },
      { name: RealtimeAuction.name, schema: RealtimeAuctionSchema },
    ]),
  ],
  controllers: [HistoricalAuctionController, RealtimeAuctionController],
  providers: [HistoricalAuctionService, RealtimeAuctionService, HistoricalAuctionRepository, RealtimeAuctionRepository],
})
export class AuctionModule {}
