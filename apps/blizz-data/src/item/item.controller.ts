import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post()
  async createItem(@Body() item: unknown) {
    await this.itemService.createItem(item);
  }

  @Get('/distinct')
  async getDistinctItemId() {
    return await this.itemService.getDistinctItemId();
  }
}
