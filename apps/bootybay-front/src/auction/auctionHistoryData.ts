import dayjs from 'dayjs';

export interface AuctionHistory {
  itemString: string;
  realm: string;
  timestamp: number;
  marketValue: number;
  historical: number;

  regionMarketValue: number;
  regionHistorical: number;
  regionSale: number;
  regionSoldPerDay: number;
  regionSalePercent: number;
}

export const dateRanges = [
  {
    value: 1,
    label: '1 day',
  },
  {
    value: 3,
    label: '3 days',
  },
  {
    value: 7,
    label: '7 days',
  },
  {
    value: 14,
    label: '14 days',
  },
  {
    value: 30,
    label: '1 months',
  },
  {
    value: 180,
    label: '6 months',
  },
  {
    value: 365,
    label: '1 year',
  },
];

const realmProps: Array<keyof AuctionHistory> = ['marketValue', 'historical'];
const regionProps: Array<keyof AuctionHistory> = [
  'regionMarketValue',
  'regionHistorical',
  'regionSale',
  'regionSoldPerDay',
  'regionSalePercent',
];

/**
 * Convert auction history data to chart
 */
export function toChart(auctionHistories: AuctionHistory[]) {
  if (auctionHistories.length === 0) {
    return {};
  }
  const xAxis = {
    data: auctionHistories.map((auction) => dayjs(auction.timestamp * 1000).format('YYYY-MM-DD HH:mm')),
    axisLabel: {
      rotate: 30,
      margin: 15,
    },
  };
  const props = auctionHistories[0].realm === 'bcc-eu' ? regionProps : realmProps;
  const series = props.map((prop) => ({
    name: prop,
    type: 'line',
    smooth: true,
    data: auctionHistories.map((auction) => auction[prop]),
  }));
  return {
    xAxis,
    yAxis: {
      axisLabel: {
        formatter: function (value: number) {
          return value / 100;
        },
      },
    },
    legend: {},
    series,
  };
}
