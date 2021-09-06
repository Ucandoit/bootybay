// import { CreateAuctionDto } from '../../dto/auction.dto';

export const realtimeAuctionsStub = () => [
  {
    itemString: '1',
    realm: 'bcc-eu-regional',
    timestamp: 1627580614,
    regionMarketValue: 1.2,
    regionHistorical: 1.5,
    regionSale: 1,
    regionSoldPerDay: 5,
    regionSalePercent: 0.2,
  },
  {
    itemString: '2',
    realm: 'bcc-eu-regional',
    timestamp: 1627580614,
    regionMarketValue: 1.2,
    regionHistorical: 1.5,
    regionSale: 1,
    regionSoldPerDay: 5,
    regionSalePercent: 0.2,
  },
];

// export const auctionStub = (): CreateAuctionDto => ({
//   itemString: '1',
//   realm: 'bcc-eu-regional',
//   timestamp: 1627580614000,
//   regionMarketValue: 1.2,
//   regionHistorical: 1.5,
//   regionSale: 1,
//   regionSoldPerDay: 5,
//   regionSalePercent: 0.2,
// });

export const realtimeRealmAuctionStub = () => ({
  itemString: '1',
  realm: 'bcc-eu-mograine-horde',
  timestamp: 1627580614000,
  marketValue: 1.2,
  minBuyout: 1.5,
  historical: 1,
  numAuctions: 5,
});

export const realtimeRealmAuctionsStub = () => [
  {
    itemString: '1',
    realm: 'bcc-eu-mograine-horde',
    timestamp: 1627580614000,
    marketValue: 1.2,
    minBuyout: 1.5,
    historical: 1,
    numAuctions: 5,
  },
  {
    itemString: '2',
    realm: 'bcc-eu-mograine-horde',
    timestamp: 1627580614000,
    marketValue: 1.2,
    minBuyout: 1.5,
    historical: 1,
    numAuctions: 5,
  },
];
