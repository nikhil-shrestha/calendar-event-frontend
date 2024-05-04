/* eslint-disable */
import { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


const navItems = [
  {
    name: 'Calendar',
    path: '/'
  },
  {
    name: 'Event',
    path: '/event'
  },
];

export default function Root() {
  const [user, setUser] = useState(null)

  return (
    <>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Calendar App
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <Button sx={{ color: '#fff' }}>{item.name}</Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main">
        <Toolbar />
        <Outlet context={{user, setUser}}/>
      </Box>
    </>
  );
}