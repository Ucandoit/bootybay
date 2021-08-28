import { RealmAuction, RegionalAuction } from './auction.dto';

export interface RecentAuctionsRequestDto {
  realm: string;
  page?: number;
  size?: number;
}

export interface RecentAuctionsResponseDto {
  page: number;
  size: number;
  total: number;
  auctions: Array<RegionalAuction & RealmAuction>;
}
