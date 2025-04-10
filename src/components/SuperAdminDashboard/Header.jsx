import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
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
      icon: PeopleIcon
    },
    {
      label: "Offers",
      icon: LocalOfferIcon
    },
    {
      label: "Products",
      icon: InventoryIcon
    },
    {
      label: "Regional admin",
      icon: MapIcon
    },
    {
      label: "Reports",
      icon: BarChartIcon
    },
    {
      label: "Sellers",
      icon: StoreIcon
    },
    {
      label: "Special Product",
      icon: StarIcon
    }
  ];

      

  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {DrawerItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
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
        {/* <Button onClick={toggleDrawer(true)}>Open drawer</Button> */}
        <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon/>
        </IconButton>
        <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
    </div>
    );
}