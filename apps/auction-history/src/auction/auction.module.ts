import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionController } from './auction.controller';
import { AuctionRepository } from './auction.repository';
import { AuctionService } from './auction.service';
import { Auction, AuctionSchema } from './schema/auction.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }])],
  controllers: [AuctionController],
  providers: [AuctionService, AuctionRepository],
})
export class AuctionModule {}
