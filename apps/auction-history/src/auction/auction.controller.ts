import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../commons/pipes/joi-validation.pipe';
import { AuctionService } from './auction.service';
import { createAuctionSchema } from './auction.validator';
import { CreateAuctionDto } from './dto/auction.dto';

@Controller()
export class AuctionController {
  constructor(private readonly auctionsService: AuctionService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createAuctionSchema))
  async createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    await this.auctionsService.createAuction(createAuctionDto);
  }
}
