import { Controller, Delete, Get, Query, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../../commons/pipes/joi-validation.pipe';
import { RealtimeAuctionService } from './realtime-auction.service';
import { realtimeAuctionsRequestSchema } from './realtime-auction.validator';
import { RealtimeAuctionsRequestDto } from './realtime-auctions.dto';

@Controller('realtime')
export class RealtimeAuctionController {
  constructor(private readonly realtimeAuctionsService: RealtimeAuctionService) {}

  @Get()
  @UsePipes(new JoiValidationPipe(realtimeAuctionsRequestSchema))
  async getRealtimeAuctionsByRealm(@Query() request: RealtimeAuctionsRequestDto) {
    return await this.realtimeAuctionsService.getAuctionByRealm(request);
  }

  @Delete('/outdated')
  async deleteOutDatedRealtimeAuctionsByRealm(@Query('realm') realm: string) {
    await this.realtimeAuctionsService.deleteOutDatedRealtimeAuctionsByRealm(realm);
  }
}
