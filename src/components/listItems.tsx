import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import AppsIcon from '@mui/icons-material/Apps';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import PersonIcon from '@mui/icons-material/Person';

export const mainListItems = (
  <React.Fragment>
    <Link to="/">
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Дашборд" />
      </ListItemButton>
    </Link>
    <Link to="/transactions">
      <ListItemButton>
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Транзакции" />
      </ListItemButton>
    </Link>
    <Link to="/users">
      <ListItemButton>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Пользователи" />
      </ListItemButton>
    </Link>
    <Link to="/teams">
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Команды" />
      </ListItemButton>
    </Link>
    <Link to="/products">
      <ListItemButton>
        <ListItemIcon>
          <AppsIcon />
        </ListItemIcon>
        <ListItemText primary="Продукты" />
      </ListItemButton>
    </Link>
    <Link to="/category">
      <ListItemButton>
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary="Категории" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

// export const secondaryListItems = (
//   <React.Fragment>
//     <ListSubheader component="div" inset>
//       Приложения
//     </ListSubheader>
//     <ListItemButton>
//       <ListItemIcon>
//         <AppShortcutIcon />
//       </ListItemIcon>
//       <ListItemText primary="Tiger 1" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AppShortcutIcon />
//       </ListItemIcon>
//       <ListItemText primary="Tiger 2" />
//     </ListItemButton>
//     <ListItemButton>
//       <ListItemIcon>
//         <AppShortcutIcon />
//       </ListItemIcon>
//       <ListItemText primary="Tiger 3" />
//     </ListItemButton>
//   </React.Fragment>
// );
