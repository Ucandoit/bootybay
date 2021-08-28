import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../commons/pipes/joi-validation.pipe';
import { AuctionService } from './auction.service';
import { createAuctionSchema, recentAuctionsRequestSchema } from './auction.validator';
import { CreateAuctionDto } from './dto/auction.dto';
import { RecentAuctionsRequestDto } from './dto/recent-auctions.dto';

@Controller()
export class AuctionController {
  constructor(private readonly auctionsService: AuctionService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createAuctionSchema))
  async createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    await this.auctionsService.createAuction(createAuctionDto);
  }

  @Get()
  @UsePipes(new JoiValidationPipe(recentAuctionsRequestSchema))
  async getAuctionsByRealm(@Query() request: RecentAuctionsRequestDto) {
    return await this.auctionsService.getAuctionByRealm(request);
  }
}
