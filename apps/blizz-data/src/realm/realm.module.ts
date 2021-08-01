import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RealmController } from './realm.controller';
import { RealmRepository } from './realm.repository';
import { RealmService } from './realm.service';
import { Realm, RealmSchema } from './schema/realm.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Realm.name, schema: RealmSchema }])],
  controllers: [RealmController],
  providers: [RealmService, RealmRepository],
})
export class RealmModule {}
