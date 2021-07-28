import { Controller, Get } from '@nestjs/common';
import { AuctionsService } from './auctions.service';

@Controller()
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Get()
  getAuctions() {
    return this.auctionsService.getAuctions();
  }
}
