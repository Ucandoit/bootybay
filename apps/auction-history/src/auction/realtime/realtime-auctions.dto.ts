import { RealmAuction, RegionalAuction } from '../dto/auction.dto';

export interface RealtimeAuctionsRequestDto {
  realm: string;
  page?: number;
  size?: number;
}

export interface RealtimeAuctionsResponseDto {
  page: number;
  size: number;
  total: number;
  auctions: Array<RegionalAuction & RealmAuction>;
}
