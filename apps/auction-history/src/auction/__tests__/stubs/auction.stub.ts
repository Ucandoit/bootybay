import { CreateAuctionDto } from '../../dto/auction.dto';

export const auctionsStub = () => [
  {
    itemId: 1,
    realm: 'bcc-eu-regional',
    timestamp: 1627580614000,
    regionMarketValue: 1.2,
    regionHistorical: 1.5,
    regionSale: 1,
    regionSoldPerDay: 5,
    regionSalePercent: 0.2,
  },
  {
    itemId: 2,
    realm: 'bcc-eu-regional',
    timestamp: 1627580614000,
    regionMarketValue: 1.2,
    regionHistorical: 1.5,
    regionSale: 1,
    regionSoldPerDay: 5,
    regionSalePercent: 0.2,
  },
];

export const auctionStub = (): CreateAuctionDto => ({
  itemId: 1,
  realm: 'bcc-eu-regional',
  timestamp: 1627580614000,
  regionMarketValue: 1.2,
  regionHistorical: 1.5,
  regionSale: 1,
  regionSoldPerDay: 5,
  regionSalePercent: 0.2,
});
