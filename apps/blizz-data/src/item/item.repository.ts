import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, FilterQuery, Model } from 'mongoose';
import { Item, ItemDocument } from './schema/item.schema';

@Injectable()
export class ItemRepository {
  constructor(@InjectModel(Item.name) private auctionModel: Model<ItemDocument>) {}
  create(createEntityData: AnyKeys<unknown>): Promise<ItemDocument> {
    return this.auctionModel.create(createEntityData);
  }

  getDistinctItemId(): Promise<number[]> {
    return this.auctionModel.distinct('id').exec();
  }

  find(query: FilterQuery<ItemDocument>): Promise<ItemDocument[]> {
    return this.auctionModel.find(query).exec();
  }
}
