import { Injectable } from '@nestjs/common';
import { ItemRepository } from './item.repository';

@Injectable()
export class ItemService {
  constructor(private itemRepository: ItemRepository) {}
  async createItem(item: unknown) {
    await this.itemRepository.create(item);
  }

  getDistinctItemId() {
    return this.itemRepository.getDistinctItemId();
  }
}
