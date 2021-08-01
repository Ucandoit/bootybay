import { Injectable } from '@nestjs/common';
import { RealmDto } from './dto/realm.dto';
import { RealmRepository } from './realm.repository';

@Injectable()
export class RealmService {
  constructor(private realmRepository: RealmRepository) {}
  async createRealms(realms: RealmDto[]) {
    await this.realmRepository.createMany(realms);
  }
}
