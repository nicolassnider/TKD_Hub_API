import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';


const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TKD_Hub
        </Typography>
        <Button color="inherit">Home</Button>
        <Button color="inherit">Blog</Button>
        <Button color="inherit">Events</Button>
        <Button color="inherit" onClick={handleMenuClick}>
          Manage
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Users</MenuItem>
          <MenuItem onClick={handleMenuClose}>Students</MenuItem>
          <MenuItem onClick={handleMenuClose}>Coaches</MenuItem>
          <MenuItem onClick={handleMenuClose}>Dojaangs</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};


export default Header;
