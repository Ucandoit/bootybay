import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type RealtimeAuctionDocument = RealtimeAuction & Document;

export type RealtimeAuctionSortableKey = keyof RealtimeAuction;

@Schema({ collection: 'realtime-auctions' })
export class RealtimeAuction {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  itemString: string;

  @Prop({ required: true })
  realm: string;

  @Prop({ required: true })
  timestamp: number;

  @Prop()
  marketValue: number;

  @Prop()
  minBuyout: number;

  @Prop()
  historical: number;

  @Prop()
  numAuctions: number;

  @Prop()
  regionMarketValue: number;

  @Prop()
  regionHistorical: number;

  @Prop()
  regionSale: number;

  @Prop()
  regionSoldPerDay: number;

  @Prop()
  regionSalePercent: number;
}
export const RealtimeAuctionSchema = SchemaFactory.createForClass(RealtimeAuction);
