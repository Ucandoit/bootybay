import { Injectable } from '@nestjs/common';

@Injectable()
export class AuctionsService {
  getAuctions(): { message: string } {
    return { message: 'Welcome to auction-history!' };
  }
}
