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
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

export default function Header() {
    const [open, setOpen] = React.useState(false);
    const [specialProductOpen, setSpecialProductOpen] = React.useState(false); // State for dropdown

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleSpecialProductClick = () => {
        setSpecialProductOpen(!specialProductOpen);
    };

    const DrawerItems = [
        {
            label: "Dashboard",
            icon: BarChartIcon,
            path: "dashboard"
        },
        {
            label: "Customers",
            icon: PeopleIcon,
            path: "users"
        },
        {
            label: "Orders",
            icon: InventoryIcon,
            path: "orders"
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
            path: "regAdminList"
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
          label: "Category",
          icon: InventoryIcon,
          path: "category"
      },
        {
            label: "Special Product",
            icon: StarIcon,
            children: [
                // { label: "Bluemedix Products", path: "bluemedix-products" },
                { label: "Top Selling Products", path: "top-selling-products" },
                // { label: "Today's Special Products", path: "todays-special-products" },
                // { label: "Popular Products", path: "popular-products" },
            ]
        }
    ];

    const DrawerList = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            // Removed onClick={toggleDrawer(false)} here
        >
            <List>
                {DrawerItems.map((item) => (
                    <React.Fragment key={item.label}>
                        {item.children ? ( // Render dropdown if it has children
                            <>
                                <ListItemButton onClick={handleSpecialProductClick}>
                                    <ListItemIcon>
                                        <item.icon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} sx={{ color: "#333" }} />
                                    {specialProductOpen ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={specialProductOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.children.map((child) => (
                                            <ListItem key={child.label} disablePadding component={NavLink} to={`/admin/${child.path}`} onClick={toggleDrawer(false)}> {/* Added onClick here */}
                                                <ListItemButton sx={{ pl: 4 }}>
                                                    <ListItemText primary={child.label} sx={{ color: "#333" }} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </>
                        ) : (
                            <ListItem disablePadding component={NavLink} to={`/admin/${item.path}`} onClick={toggleDrawer(false)}> {/* Added onClick here */}
                                <ListItemButton>
                                    <ListItemIcon>
                                        <item.icon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} sx={{ color: "#333" }} />
                                </ListItemButton>
                            </ListItem>
                        )}
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            <IconButton onClick={toggleDrawer(true)}>
                <MenuIcon />
            </IconButton>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}