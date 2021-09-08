import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { ItemModule } from './item/item.module';
import { RealmModule } from './realm/realm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get<string>('database.host')}:${configService.get<number>('database.port')}`,
        user: configService.get<string>('database.user'),
        pass: configService.get<string>('database.password'),
        dbName: configService.get<string>('database.name'),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    RealmModule,
    ItemModule,
  ],
})
export class AppModule {}
