import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import AuctionHistoryChart from './AuctionHistoryChart';

const regional = 'bcc-eu';
const realm = 'bcc-eu-mograine-horde';

export function AuctionHistoryCharts() {
  const { itemString } = useParams<{ itemString: string }>();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3 }}>
      <AuctionHistoryChart itemString={itemString} realm={realm} />
      <AuctionHistoryChart itemString={itemString} realm={regional} />
    </Box>
  );
}

export default AuctionHistoryCharts;
