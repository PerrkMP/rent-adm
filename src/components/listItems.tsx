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
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import PersonIcon from '@mui/icons-material/Person';
import jwt from "jsonwebtoken";

interface JwtPayload {
  role_id: number;
}

const token = localStorage.getItem('token');
const { role_id } = token ? (jwt.decode(token) as JwtPayload) : { role_id: 0 };

export const mainListItems = (
  <React.Fragment>
    {role_id >= 3 && (
      <Link to="/">
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Дашборд" />
        </ListItemButton>
      </Link>
    )}
    <Link to="/transactions">
      <ListItemButton>
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Транзакции" />
      </ListItemButton>
    </Link>
    <Link to="/orders">
      <ListItemButton>
        <ListItemIcon>
          <ViewStreamIcon />
        </ListItemIcon>
        <ListItemText primary="Заказы" />
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
    {role_id >= 3 && (
      <Link to="/teams">
        <ListItemButton>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Команды" />
        </ListItemButton>
      </Link>
    )}
    <Link to="/products">
      <ListItemButton>
        <ListItemIcon>
          <AppsIcon />
        </ListItemIcon>
        {role_id < 3 && (
          <ListItemText primary="Каталог" />
        )}
        {role_id >= 3 && (
          <ListItemText primary="Продукты" />
        )}
      </ListItemButton>
    </Link>
    {role_id >= 3 && (
      <Link to="/category">
        <ListItemButton>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Категории" />
        </ListItemButton>
      </Link>
    )}
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
