import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import jwt from 'jsonwebtoken';

interface OrdersProps {
  setIsLoading: (isLoading: boolean) => void;
}

interface Order {
  id: number;
  status: string;
  amount: number;
  team_id: number;
  product: {
    id: number;
    name: string;
  };
  payer_id: number;
  created_at: string;
  expire_date: string;
}

interface JwtPayload {
  role_id: number;
}

const Orders: React.FC<OrdersProps> = ({ setIsLoading }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'renew' | 'cancel' | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [renewalDays, setRenewalDays] = useState<number | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const { role_id } = token ? (jwt.decode(token) as JwtPayload) : { role_id: 0 };

  useEffect(() => {
    setIsLoading(true);
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders');
        if (response.status === 200) {
          setOrders(response.data.data);
        } else if (response.status === 401) {
          navigate("/login");
        } else if (response.status === 403) {
          navigate("/access-denied");
        } else {
          console.error('Ошибка при загрузке заказов');
        }
      } catch (error) {
        console.error('Ошибка при загрузке заказов');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [setIsLoading, navigate]);

  const handleRenew = async () => {
    if (selectedOrder) {
      try {
        await axios.patch('/orders', {
          order_id: selectedOrder.id,
          renewal_period_days: renewalDays || 30
        });
        setDialogOpen(false);
        setRenewalDays(null);
        setSelectedOrder(null);
      } catch (error) {
        console.error('Ошибка при продлении заказа', error);
      }
    }
  };

  const handleCancel = async () => {
    if (selectedOrder) {
      try {
        await axios.put('/orders', {
          order_id: selectedOrder.id
        });
        setDialogOpen(false);
        setSelectedOrder(null);
      } catch (error) {
        console.error('Ошибка при отмене заказа', error);
      }
    }
  };

  const openRenewDialog = (order: Order) => {
    setSelectedOrder(order);
    setDialogType('renew');
    setDialogOpen(true);
  };

  const openCancelDialog = (order: Order) => {
    setSelectedOrder(order);
    setDialogType('cancel');
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
    setRenewalDays(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Team ID</TableCell>
              <TableCell align="right">Product Name</TableCell>
              <TableCell align="right">Payer ID</TableCell>
              <TableCell align="right">Created At</TableCell>
              <TableCell align="right">Expire Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{order.id}</TableCell>
                <TableCell align="right">{order.status}</TableCell>
                <TableCell align="right">{order.amount}</TableCell>
                <TableCell align="right">{order.team_id}</TableCell>
                <TableCell align="right">{order.product.name}</TableCell>
                <TableCell align="right">{order.payer_id}</TableCell>
                <TableCell align="right">{order.created_at}</TableCell>
                <TableCell align="right">{order.expire_date}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => openRenewDialog(order)}>Продлить</Button>
                  <Button onClick={() => openCancelDialog(order)}>Отменить</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogType === 'renew' ? 'Продлить заказ' : 'Отменить заказ'}</DialogTitle>
        <DialogContent>
          {dialogType === 'renew' ? (
            <>
              <DialogContentText>
                {role_id < 3 ? `Подтвердите оплату заказа на сумму ${selectedOrder?.amount}` : 'Введите количество дней для продления заказа'}
              </DialogContentText>
              {role_id >= 3 && (
                <TextField
                  autoFocus
                  margin="dense"
                  label="Количество дней"
                  type="number"
                  fullWidth
                  variant="standard"
                  value={renewalDays || ''}
                  onChange={(e) => setRenewalDays(Number(e.target.value))}
                />
              )}
            </>
          ) : (
            <DialogContentText>Вы уверены, что хотите отменить заказ?</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Отмена</Button>
          <Button onClick={dialogType === 'renew' ? handleRenew : handleCancel}>
            {dialogType === 'renew' ? 'Подтвердить' : 'Отменить'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Orders;
