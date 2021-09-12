import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlizzardService } from './blizzard.service';

@Module({
  imports: [ConfigModule],
  providers: [BlizzardService],
  exports: [BlizzardService],
})
export class BlizzardModule {}
