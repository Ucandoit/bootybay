import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlizzardModule } from '../blizzard/blizzard.module';
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
    BlizzardModule,
  ],
  controllers: [HistoricalAuctionController, RealtimeAuctionController],
  providers: [HistoricalAuctionService, RealtimeAuctionService, HistoricalAuctionRepository, RealtimeAuctionRepository],
})
export class AuctionModule {}
