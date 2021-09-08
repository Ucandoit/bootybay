import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, FilterQuery, Model } from 'mongoose';
import {
  HistoricalAuction,
  HistoricalAuctionDocument,
  HistoricalAuctionSortableKey,
} from './historical-auction.schema';

@Injectable()
export class HistoricalAuctionRepository {
  constructor(@InjectModel(HistoricalAuction.name) private auctionModel: Model<HistoricalAuctionDocument>) {}

  find(
    query: FilterQuery<HistoricalAuctionDocument>,
    sortOrder: Partial<{ [key in HistoricalAuctionSortableKey]: 1 | -1 }>
  ): Promise<HistoricalAuctionDocument[]> {
    return this.auctionModel.find(query).sort(sortOrder).exec();
  }

  async createMany(createEntityDatas: Array<AnyKeys<unknown>>): Promise<HistoricalAuctionDocument[]> {
    return this.auctionModel.insertMany(createEntityDatas);
  }

  async getDistinctItemString(): Promise<string[]> {
    return this.auctionModel.distinct('itemString');
  }
}
