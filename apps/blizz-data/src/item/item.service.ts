import { Item } from '@bootybay/common-interfaces';
import { Injectable } from '@nestjs/common';
import { ItemRepository } from './item.repository';
import { ItemDocument } from './schema/item.schema';

@Injectable()
export class ItemService {
  constructor(private itemRepository: ItemRepository) {}
  async createItem(item: unknown) {
    await this.itemRepository.create(item);
  }

  getDistinctItemId() {
    return this.itemRepository.getDistinctItemId();
  }

  async getItems(ids: number[]): Promise<Item[]> {
    const documents: ItemDocument[] = await this.itemRepository.find({ id: { $in: ids } });
    return documents.map((document) => ({ id: document.id, name: document.name }));
  }
}
