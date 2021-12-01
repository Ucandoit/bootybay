import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import useAsyncFunction from '../commons/helper/useAsyncFunction';
import usePagination from '../commons/table/usePagination';
import CurrencyText from './MoneyText';

export interface AuctionsResponse {
  total: number;
  auctions: Array<{
    itemString: string;
    name?: string;
    regionMarketValue: number;
    regionHistorical: number;
    regionSale: number;
    regionSoldPerDay: number;
    regionSalePercent: number;
    marketValue: number;
    minBuyout: number;
    historical: number;
    numAuctions: number;
  }>;
}

async function getMostRecentAuctions(realm: string, page: number, size: number): Promise<AuctionsResponse> {
  const data = await fetch(`/api/auction-history/realtime?realm=${realm}&page=${page}&size=${size}`);
  return data.json();
}

const realms = [
  {
    id: 'bcc-eu-mograine-horde',
    label: 'Mograine Horde (EU TBC)',
  },
  {
    id: 'bcc-eu-firemaw-horde',
    label: 'Firemaw Horde (EU TBC)',
  },
];

const initValue: AuctionsResponse = {
  total: 0,
  auctions: [],
};
export function AuctionTable() {
  const [realm, setRealm] = useState('bcc-eu-mograine-horde');
  const { page, size, changePage, changeRowsPerPage } = usePagination();
  const {
    value: { total, auctions },
    isPending,
  } = useAsyncFunction<AuctionsResponse>(getMostRecentAuctions, initValue, realm, page, size);

  return (
    <>
      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Box>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="realm-filter">Select a realm</InputLabel>
            <Select labelId="realm-filter" value={realm} onChange={(e) => setRealm(e.target.value)}>
              {realms.map(({ id, label }) => (
                <MenuItem key={id} value={id}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell align={'center'}>Name</TableCell>
              <TableCell align={'right'}>Market</TableCell>
              <TableCell align={'right'}>Region market</TableCell>
              <TableCell align={'right'}>Historical</TableCell>
              <TableCell align={'right'}>Region historical</TableCell>
              <TableCell align={'right'}>Region sale</TableCell>
              <TableCell align={'right'}>Lowest</TableCell>
              <TableCell align={'right'}>Region sale rate</TableCell>
              <TableCell align={'right'}>Region sold per day</TableCell>
              <TableCell align={'right'}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell>Loading</TableCell>
              </TableRow>
            ) : (
              auctions.map((auction) => (
                <TableRow key={auction.itemString} hover>
                  <TableCell align={'center'}>
                    <Link href={`/auctions/${auction.itemString}`}>{auction.name ?? auction.itemString}</Link>
                  </TableCell>
                  <TableCell align={'right'}>
                    <CurrencyText value={auction.marketValue} />
                  </TableCell>
                  <TableCell align={'right'}>
                    <CurrencyText value={auction.regionMarketValue} />
                  </TableCell>
                  <TableCell align={'right'}>
                    <CurrencyText value={auction.historical} />
                  </TableCell>
                  <TableCell align={'right'}>
                    <CurrencyText value={auction.regionHistorical} />
                  </TableCell>
                  <TableCell align={'right'}>
                    <CurrencyText value={auction.regionSale} />
                  </TableCell>
                  <TableCell align={'right'}>
                    <CurrencyText value={auction.minBuyout} />
                  </TableCell>
                  <TableCell align={'right'}>{auction.regionSalePercent}%</TableCell>
                  <TableCell align={'right'}>{auction.regionSoldPerDay / 100}</TableCell>
                  <TableCell align={'right'}>{auction.numAuctions}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20]}
        component="div"
        count={total}
        rowsPerPage={size}
        page={page}
        onPageChange={changePage}
        onRowsPerPageChange={changeRowsPerPage}
      />
    </>
  );
}

export default AuctionTable;
