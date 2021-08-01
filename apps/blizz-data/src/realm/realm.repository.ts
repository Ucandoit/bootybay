import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, Model } from 'mongoose';
import { Realm, RealmDocument } from './schema/realm.schema';

@Injectable()
export class RealmRepository {
  constructor(@InjectModel(Realm.name) private auctionModel: Model<RealmDocument>) {}
  async createMany(createEntityDatas: Array<AnyKeys<unknown>>): Promise<RealmDocument[]> {
    return this.auctionModel.insertMany(createEntityDatas);
  }
}
