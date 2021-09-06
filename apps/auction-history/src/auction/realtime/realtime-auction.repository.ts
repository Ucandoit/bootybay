import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, FilterQuery, Model } from 'mongoose';
import { RealtimeAuction, RealtimeAuctionDocument, RealtimeAuctionSortableKey } from './realtime-auction.schema';

@Injectable()
export class RealtimeAuctionRepository {
  private readonly logger = new Logger(RealtimeAuctionRepository.name);
  constructor(@InjectModel(RealtimeAuction.name) private auctionModel: Model<RealtimeAuctionDocument>) {}

  find(
    query: FilterQuery<RealtimeAuctionDocument>,
    sortOrder: Partial<{ [key in RealtimeAuctionSortableKey]: 1 | -1 }>,
    limit: number
  ): Promise<RealtimeAuctionDocument[]> {
    return this.auctionModel.find(query).sort(sortOrder).limit(limit).exec();
  }

  async createMany(createEntityDatas: Array<AnyKeys<unknown>>): Promise<RealtimeAuctionDocument[]> {
    return this.auctionModel.insertMany(createEntityDatas);
  }

  async deleteMany(query: FilterQuery<RealtimeAuctionDocument>): Promise<void> {
    const deleteResult = await this.auctionModel.deleteMany(query).exec();
    if (deleteResult.deletedCount > 0) {
      this.logger.log(`${deleteResult.deletedCount} documents deleted in realtime-auctions.`);
    } else {
      this.logger.warn('No document deleted in realtime-auctions.');
    }
  }

  async findMostRecentByRealm(
    realm: string,
    page: number,
    size: number,
    sort = 'regionSoldPerDay'
  ): Promise<Array<RealtimeAuctionDocument>> {
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
      .aggregate<RealtimeAuctionDocument>()
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
