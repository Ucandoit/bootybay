import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, Model } from 'mongoose';
import { Auction, AuctionDocument } from './schema/auction.schema';

@Injectable()
export class AuctionRepository {
  constructor(@InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>) {}
  async create(createEntityData: AnyKeys<unknown>): Promise<AuctionDocument> {
    return this.auctionModel.create(createEntityData);
  }

  async createMany(createEntityDatas: Array<AnyKeys<unknown>>): Promise<AuctionDocument[]> {
    return this.auctionModel.insertMany(createEntityDatas);
  }
}
