import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { NavLink } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import MapIcon from '@mui/icons-material/Map';
import BarChartIcon from '@mui/icons-material/BarChart';
import StoreIcon from '@mui/icons-material/Store';
import StarIcon from '@mui/icons-material/Star';

export default function Header(){

    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerItems = [
      {
        label: "Customers",
        icon: PeopleIcon,
        path: "users"
      },
      {
        label: "Offers",
        icon: LocalOfferIcon,
        path: "offers"
      },
      {
        label: "Products",
        icon: InventoryIcon,
        path: "products"
      },
      {
        label: "Regional admin",
        icon: MapIcon,
        path: "regional-admin"
      },
      {
        label: "Reports",
        icon: BarChartIcon,
        path: "reports"
      },
      {
        label: "Sellers",
        icon: StoreIcon,
        path: "sellers"
      },
      {
        label: "Special Product",
        icon: StarIcon,
        path: "special-product"
      }
    ];
    

      

  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {DrawerItems.map((item) => (
          <React.Fragment key={item.label}>
            <ListItem disablePadding component={NavLink} to={`/superadmin/${item.path}`}>
              <ListItemButton>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{color:"#333"}} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
  
    

    return(
    <div>
        <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon/>
        </IconButton>
        <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
    </div>
    );
}