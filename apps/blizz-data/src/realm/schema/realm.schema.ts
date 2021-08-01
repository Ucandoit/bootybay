import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type RealmDocument = Realm & Document;

@Schema({ collection: 'realms' })
export class Realm {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  region: string;
}
export const RealmSchema = SchemaFactory.createForClass(Realm);
