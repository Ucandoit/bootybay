import { BrowserRouter, Route } from 'react-router-dom';
import AuctionHistoryCharts from '../auction/AuctionHistoryCharts';
import AuctionTable from '../auction/AuctionTable';
import Dashboard from '../dashboard/Dashboard';
import AppBar from './AppBar';

export function App() {
  return (
    <>
      <AppBar />
      <BrowserRouter>
        <Route path="/" exact>
          <Dashboard />
        </Route>
        <Route path="/auctions" exact>
          <AuctionTable />
        </Route>
        <Route path="/auctions/:itemString">
          <AuctionHistoryCharts />
        </Route>
      </BrowserRouter>
    </>
  );
}

export default App;
