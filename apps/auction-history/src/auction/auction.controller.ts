import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../commons/pipes/JoiValidationPipe';
import { AuctionService } from './auction.service';
import { createAuctionSchema } from './auction.validator';
import { CreateAuctionDto } from './dto/auction.dto';

@Controller()
export class AuctionController {
  constructor(private readonly auctionsService: AuctionService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createAuctionSchema))
  createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    this.auctionsService.createAuction(createAuctionDto);
  }
}
