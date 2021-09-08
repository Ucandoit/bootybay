import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemController } from './item.controller';
import { ItemRepository } from './item.repository';
import { ItemService } from './item.service';
import { Item, ItemSchema } from './schema/item.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }])],
  controllers: [ItemController],
  providers: [ItemService, ItemRepository],
})
export class ItemModule {}
