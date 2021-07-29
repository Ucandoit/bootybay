import { Body, Controller, Post } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/auction.dto';

@Controller()
export class AuctionController {
  constructor(private readonly auctionsService: AuctionService) {}

  @Post()
  createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    this.auctionsService.createAuction(createAuctionDto);
  }
}
