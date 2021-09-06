import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../../commons/pipes/joi-validation.pipe';
import { RealmAuction, RegionalAuction } from '../dto/auction.dto';
import { HistoricalAuctionService } from './historical-auction.service';
import { createAuctionsSchema } from './historical-auction.validator';

@Controller('historical')
export class HistoricalAuctionController {
  constructor(private readonly historicalAuctionsService: HistoricalAuctionService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createAuctionsSchema))
  async createAuctions(@Body() createAuctionsDto: Array<RegionalAuction | RealmAuction>) {
    await this.historicalAuctionsService.createAuctions(createAuctionsDto);
  }

  @Get('/:itemString')
  async getAuction(
    @Param('itemString') itemString: string,
    @Query('realm') realm: string,
    @Query('timestamp') timestamp: number
  ) {
    return await this.historicalAuctionsService.getAuctionHistories(itemString, realm, timestamp);
  }
}
