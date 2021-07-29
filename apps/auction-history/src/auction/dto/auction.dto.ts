interface BaseAuction {
  itemId: number;
  realm: string;
  timestamp: number;
}

export interface RegionalAuction extends BaseAuction {
  regionMarketValue: number;
  regionHistorical: number;
  regionSale: number;
  regionSoldPerDay: number;
  regionSalePercent: number;
}

export interface RealmAuction extends BaseAuction {
  marketValue: number;
  minBuyout: number;
  historical: number;
  numAuctions: number;
}

export type CreateAuctionDto = RegionalAuction | RealmAuction | RegionalAuction[] | RealmAuction[];
