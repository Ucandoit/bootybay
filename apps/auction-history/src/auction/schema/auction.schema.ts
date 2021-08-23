import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type AuctionDocument = Auction & Document;

@Schema({ collection: 'auctions' })
export class Auction {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  itemId: number;

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
export const AuctionSchema = SchemaFactory.createForClass(Auction);
