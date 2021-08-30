import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function AppBar() {
  return (
    <MuiAppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
          Bootybay
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button sx={{ mx: 1, my: 2, color: 'white', display: 'block' }} href="/auctions">
            Auctions
          </Button>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}
