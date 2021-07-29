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

export const realAuctionStub = (): CreateAuctionDto => ({
  itemId: 1,
  realm: 'bcc-eu-mograine-horde',
  timestamp: 1627580614000,
  marketValue: 1.2,
  minBuyout: 1.5,
  historical: 1,
  numAuctions: 5,
});

export const realAuctionsStub = (): CreateAuctionDto => [
  {
    itemId: 1,
    realm: 'bcc-eu-mograine-horde',
    timestamp: 1627580614000,
    marketValue: 1.2,
    minBuyout: 1.5,
    historical: 1,
    numAuctions: 5,
  },
  {
    itemId: 2,
    realm: 'bcc-eu-mograine-horde',
    timestamp: 1627580614000,
    marketValue: 1.2,
    minBuyout: 1.5,
    historical: 1,
    numAuctions: 5,
  },
];
