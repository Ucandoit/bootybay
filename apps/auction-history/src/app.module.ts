import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionModule } from './auction/auction.module';
import configuration from './config/configuration';

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
    AuctionModule,
  ],
})
export class AppModule {}
