import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Import the configured axios
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, AppBar, Toolbar, IconButton, Typography, Container,
  TextField, MenuItem, Box, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';

interface TransactionsProps {
  setIsLoading: (isLoading: boolean) => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const paymentMethods = [
  { id: 0, display_name: 'Перевод криптовалюты' },
  { id: 1, display_name: 'Банковский перевод' },
  { id: 2, display_name: 'Кошелек' },
];

const Transactions: React.FC<TransactionsProps> = ({ setIsLoading }) => {
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    type: 'payment',
    payer_id: 0,
    wallet_id: 0,
    payment_method_id: 0,
    amount: 0,
    comment: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios.get('/transactions')
      .then(response => {
        if (response.status === 200) {
          setRows(response.data.data);
        } else {
          alert('Неизвестная ошибка при получении транзакций');
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          alert('Ошибка при получении транзакций');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    axios.get('/users')
      .then(response => {
        if (response.status === 200) {
          setClients(response.data.data.filter((client: any) => client.wallet));
        } else {
          alert('Неизвестная ошибка при получении пользователей');
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          alert('Ошибка при получении пользователей');
        }
      });
  }, [setIsLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedClient = clients.find(client => client.id === parseInt(e.target.value));
    setFormData({
      ...formData,
      payer_id: selectedClient.id,
      wallet_id: selectedClient.wallet.id
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      type: 'payment',
      payer_id: 0,
      wallet_id: 0,
      payment_method_id: 0,
      amount: 0,
      comment: ''
    });
  };

  const handleSave = () => {
    setIsLoading(true);
    axios.post('/transactions', formData)
      .then(response => {
        if (response.status === 200) {
          setOpen(false);
          axios.get('/transactions')
            .then(response => {
              if (response.status === 200) {
                setRows(response.data.data);
              } else {
                alert('Неизвестная ошибка при обновлении транзакций');
              }
            })
            .catch(error => {
              if (error.response && error.response.status === 401) {
                navigate('/login');
              } else {
                alert('Ошибка при обновлении транзакций');
              }
            });
        } else {
          alert('Неизвестная ошибка при создании транзакции');
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          alert('Ошибка при создании транзакции');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChipClick = (label: string) => {
    setFormData({
      ...formData,
      comment: label
    });
  };

  const chips = ['Chip 1', 'Chip 2', 'Chip 3'];

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Создать транзакцию
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Статус</TableCell>
              <TableCell align="right">Тип</TableCell>
              <TableCell align="right">Плательщик</TableCell>
              <TableCell align="right">Баланс кошелька</TableCell>
              <TableCell align="right">Валюта</TableCell>
              <TableCell align="right">Способ оплаты</TableCell>
              <TableCell align="right">Сумма</TableCell>
              <TableCell align="right">Инициатор</TableCell>
              <TableCell align="right">Дата создания</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.payer.username}</TableCell>
                <TableCell align="right">{row.wallet.balance}</TableCell>
                <TableCell align="right">{row.wallet.currency}</TableCell>
                <TableCell align="right">{row.payment_method.name}</TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">{row.initiator}</TableCell>
                <TableCell align="right">{new Date(row.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Создание транзакции
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSave}>
              Сохранить
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
          <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
            <TextField
              id="type"
              select
              label="Тип транзакции"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <MenuItem value="payment">Платеж</MenuItem>
              <MenuItem value="refill">Пополнение</MenuItem>
            </TextField>
            <TextField
              id="payer_id"
              select
              label="Клиент"
              name="payer_id"
              value={formData.payer_id}
              onChange={handleClientChange}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>{client.username}</MenuItem>
              ))}
            </TextField>
            <TextField
              id="wallet_id"
              label="Кошелек"
              name="wallet_id"
              value={formData.wallet_id}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              id="payment_method_id"
              select
              label="Способ оплаты"
              name="payment_method_id"
              value={formData.payment_method_id}
              onChange={handleChange}
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method.id} value={method.id}>{method.display_name}</MenuItem>
              ))}
            </TextField>
            <TextField
              id="amount"
              label="Сумма платежа"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
            />
            <TextField
              id="comment"
              label="Комментарий платежа"
              name="comment"
              multiline
              rows={4}
              value={formData.comment}
              onChange={handleChange}
              helperText="Выберите комментарий ниже"
            />
            {chips.map((chip, index) => (
              <Chip key={index} label={chip} variant="outlined" onClick={() => handleChipClick(chip)} />
            ))}
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default Transactions;
