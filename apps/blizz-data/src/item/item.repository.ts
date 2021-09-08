import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, Model } from 'mongoose';
import { Item, ItemDocument } from './schema/item.schema';

@Injectable()
export class ItemRepository {
  constructor(@InjectModel(Item.name) private auctionModel: Model<ItemDocument>) {}
  async create(createEntityData: AnyKeys<unknown>): Promise<ItemDocument> {
    return this.auctionModel.create(createEntityData);
  }

  async getDistinctItemId(): Promise<number[]> {
    return this.auctionModel.distinct('id');
  }
}
