import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import useAsyncFunction from '../commons/helper/useAsyncFunction';
import usePagination from '../commons/table/usePagination';

export interface AuctionsResponse {
  total: number;
  auctions: Array<{
    itemString: string;
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

const getMostRecentAuctions = async (realm: string, page: number, size: number): Promise<AuctionsResponse> => {
  const data = await fetch(`/api/auction-history?realm=${realm}&page=${page}&size=${size}`);
  return data.json();
};

const initValue: AuctionsResponse = {
  total: 0,
  auctions: [],
};
export function AuctionTable() {
  const { page, size, changePage, changeRowsPerPage } = usePagination();
  const {
    value: { total, auctions },
    isPending,
  } = useAsyncFunction<AuctionsResponse>(getMostRecentAuctions, initValue, 'bcc-eu-mograine-horde', page, size);
  return (
    <>
      <TableContainer component={Paper} sx={{ width: '100%' }}>
        {/* TODO: add filters */}
        <Box>Todo: add filters</Box>
        <Table aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Market</TableCell>
              <TableCell>Region market</TableCell>
              <TableCell>Historical</TableCell>
              <TableCell>Region historical</TableCell>
              <TableCell>Region sale</TableCell>
              <TableCell>Region sale rate</TableCell>
              <TableCell>Region sold per day</TableCell>
              <TableCell>Lowest</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell>Loading</TableCell>
              </TableRow>
            ) : (
              auctions.map((auction) => (
                <TableRow key={auction.itemString}>
                  <TableCell>{auction.itemString}</TableCell>
                  <TableCell>{auction.marketValue}</TableCell>
                  <TableCell>{auction.regionMarketValue}</TableCell>
                  <TableCell>{auction.historical}</TableCell>
                  <TableCell>{auction.regionHistorical}</TableCell>
                  <TableCell>{auction.regionSale}</TableCell>
                  <TableCell>{auction.regionSalePercent}</TableCell>
                  <TableCell>{auction.regionSoldPerDay}</TableCell>
                  <TableCell>{auction.minBuyout}</TableCell>
                  <TableCell>{auction.numAuctions}</TableCell>
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
