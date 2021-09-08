import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type ItemDocument = Item & Document;

@Schema({ collection: 'items', strict: false })
export class Item {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  name: string;
}
export const ItemSchema = SchemaFactory.createForClass(Item);
