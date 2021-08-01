import { Body, Controller, Post } from '@nestjs/common';
import { RealmDto } from './dto/realm.dto';
import { RealmService } from './realm.service';

@Controller('realms')
export class RealmController {
  constructor(private realmService: RealmService) {}

  @Post()
  async createRealms(@Body() realms: RealmDto[]) {
    await this.realmService.createRealms(realms);
  }
}
