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

  async findMostRecentByRealm(
    realm: string,
    page: number,
    size: number,
    sort = 'regionSoldPerDay'
  ): Promise<Array<AuctionDocument>> {
    const realms = new Set(['bcc-eu']);
    realms.add(realm);

    const groupFields = [
      'numAuctions',
      'historical',
      'minBuyout',
      'marketValue',
      'regionMarketValue',
      'regionHistorical',
      'regionSale',
      'regionSalePercent',
      'regionSoldPerDay',
    ];

    return await this.auctionModel
      .aggregate<AuctionDocument>()
      // stage 1: filter by realms (target realm + regional)
      .match({
        realm: {
          $in: Array.from(realms),
        },
      })
      // stage 2: sort by timestamp desc to make sure the most recent record is the first one
      .sort({
        timestamp: -1,
      })
      // stage 3: group by itemString and realm, and get the most recent record for each pair
      .group({
        _id: {
          itemString: '$itemString',
          realm: '$realm',
        },
        ...this.generateGroupFields(['timestamp', ...groupFields], '$first'),
      })
      // stage 4: group by itemString to merge realm and regional data into same record
      .group({
        _id: '$_id.itemString',
        ...this.generateGroupFields(groupFields, '$max'),
      })
      .addFields({
        itemString: '$_id',
        realm,
      })
      .sort({
        [sort]: -1,
      })
      .skip(page * size)
      .limit(size);
  }

  async countMostRecentByRealm(realm: string): Promise<number> {
    const realms = new Set(['bcc-eu']);
    realms.add(realm);

    const countResult = await this.auctionModel
      .aggregate()
      // stage 1: filter by realms (target realm + regional)
      .match({
        realm: {
          $in: Array.from(realms),
        },
      })
      // stage 2: group by itemString
      .group({
        _id: {
          itemString: '$itemString',
        },
      })
      // stage 3: count
      .count('total');
    return countResult[0].total;
  }

  /**
   * Generates each field in group aggregation with the given operator
   */
  private generateGroupFields(fields: string[], groupOperator: string): Record<string, unknown> {
    return fields.reduce((acc: Record<string, unknown>, field) => {
      acc[field] = {
        [groupOperator]: `$${field}`,
      };
      return acc;
    }, {});
  }
}
