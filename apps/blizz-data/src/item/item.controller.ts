import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ItemsRequest } from './dto/items-request.dto';
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

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async getItems(@Query() request: ItemsRequest) {
    return await this.itemService.getItems(request.ids);
  }
}
