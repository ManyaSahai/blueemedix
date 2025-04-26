import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Typography,
} from '@mui/material';
import {
  MedicalServices,
  Help,
  Healing,
  Store,
  AdminPanelSettings,
  ShoppingCart,
  Assessment,
  Category,
  Inventory,
  Receipt,
  Redeem,
  LocalOffer,
  LocalShipping,
  Discount,
  Person,
  Wallet,
  Notifications,
  Article,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const drawerWidth = 240;

const Logo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  ...theme.mixins.toolbar,
}));

const Sidebar = ({ open }) => {
  const [openLists, setOpenLists] = useState({
    orders: false,
    sellers: false,
    reports: false,
    content: false,
    promotional: false,
    offers: false,
  });

  const handleToggle = (section) => {
    setOpenLists({
      ...openLists,
      [section]: !openLists[section],
    });
  };

  const menuItems = [
    { 
      type: 'item', 
      icon: <MedicalServices />, 
      text: 'Pharmacist' 
    },
    { 
      type: 'item', 
      icon: <Help />, 
      text: 'Asked Question' 
    },
    { 
      type: 'item', 
      icon: <Healing />, 
      text: 'Requested Medicine' 
    },
    { 
      type: 'item', 
      icon: <Store />, 
      text: 'Franchise Enquiry List' 
    },
    { 
      type: 'collapsible', 
      id: 'sellers',
      icon: <AdminPanelSettings />, 
      text: 'Sellers', 
      items: [
        { text: 'Add Seller' },
        { text: 'Manage Sellers' },
        { text: 'Seller Verification' }
      ] 
    },
    { 
      type: 'collapsible', 
      id: 'adminOrders',
      icon: <AdminPanelSettings />, 
      text: 'Admin Orders' 
    },
    { 
      type: 'item', 
      icon: <ShoppingCart />, 
      text: 'Customer Orders' 
    },
    { 
      type: 'item', 
      icon: <Healing />, 
      text: 'Refill Orders' 
    },
    { 
      type: 'item', 
      icon: <Receipt />, 
      text: 'Orders Receipt' 
    },
    { 
      type: 'collapsible', 
      id: 'regionalAdmins',
      icon: <AdminPanelSettings />, 
      text: 'Regional Admins',
      items: [
        { text: 'Add Admin' },
        { text: 'Manage Admins' }
      ] 
    },
    { 
      type: 'item', 
      icon: <Category />, 
      text: 'Category' 
    },
    { 
      type: 'item', 
      icon: <Inventory />, 
      text: 'Products' 
    },
    { 
      type: 'item', 
      icon: <Discount />, 
      text: 'Category Discount' 
    },
    { 
      type: 'item', 
      icon: <Person />, 
      text: 'Customers' 
    },
    { 
      type: 'collapsible', 
      id: 'reports',
      icon: <Assessment />, 
      text: 'Reports',
      items: [
        { text: 'Order Report' },
        { text: 'Sales Report' },
        { text: 'User Report' }
      ] 
    },
    { 
      type: 'item', 
      icon: <LocalOffer />, 
      text: 'Banner' 
    },
    { 
      type: 'item', 
      icon: <Redeem />, 
      text: 'Manage Promotional' 
    },
    { 
      type: 'collapsible', 
      id: 'promotional',
      icon: <LocalOffer />, 
      text: 'Promotional sections' 
    },
    { 
      type: 'collapsible', 
      id: 'offers',
      icon: <LocalOffer />, 
      text: 'Offer sections',
      items: [
        { text: "Today's Special" },
        { text: "Top-Selling Products" },
        { text: "BlueMedix Products" }
      ] 
    },
    { 
      type: 'item', 
      icon: <LocalShipping />, 
      text: 'Delivery Charge' 
    },
    { 
      type: 'item', 
      icon: <Discount />, 
      text: 'Promocode' 
    },
    { 
      type: 'item', 
      icon: <Wallet />, 
      text: 'Wallet' 
    },
    { 
      type: 'item', 
      icon: <Notifications />, 
      text: 'Notifications/Email Marketing' 
    },
    { 
      type: 'collapsible', 
      id: 'content',
      icon: <Article />, 
      text: 'Content Master',
      items: [
        { text: 'FAQ' },
        { text: 'About Us' },
        { text: 'Terms & Conditions' },
        { text: 'Privacy Policy' }
      ] 
    },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Logo>
        <MedicalServices color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" color="primary" component="div">
          BlueMedix
        </Typography>
      </Logo>
      <Divider />
      <List>
        {menuItems.map((item, index) => {
          if (item.type === 'item') {
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            );
          } else if (item.type === 'collapsible') {
            return (
              <React.Fragment key={index}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleToggle(item.id)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {openLists[item.id] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                {item.items && (
                  <Collapse in={openLists[item.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.items.map((subItem, subIndex) => (
                        <ListItemButton key={subIndex} sx={{ pl: 4 }}>
                          <ListItemText primary={subItem.text} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          }
          return null;
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;