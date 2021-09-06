import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import dayjs from 'dayjs';
import type { ECharts } from 'echarts';
import { getInstanceByDom, init } from 'echarts';
import { useEffect, useRef, useState } from 'react';
import useAsyncFunction from '../commons/helper/useAsyncFunction';
import { AuctionHistory, dateRanges, toChart } from './auctionHistoryData';

const defaultRange = 7;

const defaultTimestamp = dayjs().subtract(defaultRange, 'day').unix();

const emptyArray: AuctionHistory[] = [];

async function getAuctionHistories(itemString: string, realm: string, timestamp: number): Promise<AuctionHistory[]> {
  const data = await fetch(`/api/auction-history/historical/${itemString}?realm=${realm}&timestamp=${timestamp}`);
  return data.json();
}
interface AuctionHistoryChartProps {
  itemString: string;
  realm: string;
}

export function AuctionHistoryChart({ itemString, realm }: AuctionHistoryChartProps): JSX.Element {
  const [range, setRange] = useState<number>(defaultRange);
  const [timestamp, setTimestamp] = useState<number>(defaultTimestamp);
  const { value: auctionHistories, isPending } = useAsyncFunction<AuctionHistory[]>(
    getAuctionHistories,
    emptyArray,
    itemString,
    realm,
    timestamp
  );

  function handleRangeChange(event: SelectChangeEvent<number>) {
    const value = event.target.value as number;
    setRange(value);
    setTimestamp(dayjs().subtract(value, 'day').unix());
  }

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current);
    }

    // Add chart resize listener
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener('resize', resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener('resize', resizeChart);
    };
  }, []);

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current) as ECharts;
      if (isPending) {
        chart.showLoading();
      } else {
        chart.hideLoading();
        chart.setOption(toChart(auctionHistories));
      }
    }
  }, [isPending, auctionHistories]);

  return (
    <Box component={Paper} sx={{ flexGrow: 1, m: 1, width: '50%' }}>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id={`date-range-${itemString}-${realm}`}>Select date range</InputLabel>
        <Select labelId={`date-range-${itemString}-${realm}`} value={range} onChange={handleRangeChange}>
          {dateRanges.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box ref={chartRef} sx={{ width: '100%', height: 400 }} />
    </Box>
  );
}

export default AuctionHistoryChart;
