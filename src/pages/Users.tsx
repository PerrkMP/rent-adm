import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Импортируйте настроенный axios
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { CSSTransition } from 'react-transition-group';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './AlertAnimation.css'; // Добавьте этот файл для анимации
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';


interface UsersProps {
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

const roles = [
  {
    value: '0',
    label: 'Guest',
  },
  {
    value: '1',
    label: 'User',
  },
  {
    value: '2',
    label: 'Head',
  },
  {
    value: '3',
    label: 'Manager',
  },
  {
    value: '4',
    label: 'Admin',
  },
];

const Users: React.FC<UsersProps> = ({ setIsLoading }) => {
  const [rows, setRows] = useState<any[]>([]);
  const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' | undefined }>({ message: '', severity: undefined });
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({ telegram_id: 0, name: '', username: '', phone: 0, role_id: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios.get('/users')
      .then(response => {
        if (response.status === 200) {
          setRows(response.data.data);
          setAlert({ message: response.data.detail.details.msg, severity: 'success' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        } else {
          setAlert({ message: 'Неизвестная ошибка', severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            setIsLoading(false);
            navigate('/login');
          }
          if (error.response.status === 403) {
            setIsLoading(false);
            navigate('/access-denied');
          }
          setAlert({ message: error.response.data.detail.details.msg, severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setIsLoading, navigate]);

  const handleActivate = (id: number) => {
    axios.post(`/users/activate/${id}`)
      .then(response => {
        if (response.status === 200) {
          setAlert({ message: response.data.detail.details.msg, severity: 'success' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        } else {
          setAlert({ message: 'Неизвестная ошибка', severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            setIsLoading(false);
            navigate('/login');
          }
          setAlert({ message: error.response.data.detail.details.msg, severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      });

    setIsLoading(true);
    axios.get('/users')
      .then(response => {
        if (response.status === 200) {
          setRows(response.data.data);
          setAlert({ message: response.data.detail.details.msg, severity: 'success' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        } else {
          setAlert({ message: 'Неизвестная ошибка', severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            setIsLoading(false);
            navigate('/login');
          }
          setAlert({ message: error.response.data.detail.details.msg, severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
    console.log(`Активировать пользователя с id: ${id}`);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setFormData({
      telegram_id: user.telegram_id,
      name: user.name,
      username: user.username,
      phone: user.phone,
      role_id: user.role_id
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleSave = () => {
    setIsLoading(true);
    handleClose();
    axios.patch(`/users`, formData)
      .then(response => {
        if (response.status === 200) {
          setAlert({ message: response.data.detail.details.msg, severity: 'success' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
          // Обновить список пользователей после успешного обновления
        } else {
          setAlert({ message: 'Неизвестная ошибка', severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            setIsLoading(false);
            navigate('/login');
          }
          setAlert({ message: error.response.data.detail.details.msg, severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      });

    axios.get('/users')
      .then(response => {
        if (response.status === 200) {
          setRows(response.data.data);
          setAlert({ message: response.data.detail.details.msg, severity: 'success' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        } else {
          setAlert({ message: 'Неизвестная ошибка', severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            setIsLoading(false);
            navigate('/login');
          }
          setAlert({ message: error.response.data.detail.details.msg, severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleCreateWallet = () => {
    setOpen(false); // Закрыть модальное окно
    setIsLoading(true); // Включить экран загрузки

    axios.post(`/wallets/${selectedUser.id}`)
      .then(response => {
        if (response.status === 200) {
          setAlert({ message: response.data.detail.details.msg, severity: 'success' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        } else {
          setAlert({ message: 'Неизвестная ошибка', severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            setIsLoading(false);
            navigate('/login');
          }
          setAlert({ message: error.response.data.detail.details.msg, severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      })
      .finally(() => {
        setIsLoading(false); // Убрать экран загрузки
        // Обновить список пользователей после создания кошелька
        axios.get('/users')
          .then(response => {
            if (response.status === 200) {
              setRows(response.data.data);
              setAlert({ message: response.data.detail.details.msg, severity: 'success' });
              setShowAlert(true);
              setTimeout(() => setShowAlert(false), 2500);
            } else {
              setAlert({ message: 'Неизвестная ошибка', severity: 'error' });
              setShowAlert(true);
              setTimeout(() => setShowAlert(false), 2500);
            }
          })
          .catch(error => {
            if (error.response) {
              if (error.response.status === 401) {
                setIsLoading(false);
                navigate('/login');
              }
              setAlert({ message: error.response.data.detail.details.msg, severity: 'error' });
              setShowAlert(true);
              setTimeout(() => setShowAlert(false), 2500);
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      });
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', type: 'number', width: 70 },
    { field: 'telegram_id', headerName: 'Telegram ID', type: 'number', width: 150 },
    { field: 'name', headerName: 'Имя', width: 130 },
    { field: 'username', headerName: 'Имя пользователя (Username)', width: 150 },
    { field: 'phone', headerName: 'Номер тел.', type: 'number', width: 130 },
    { field: 'role_id', headerName: 'ID роли', type: 'number', width: 70 },
    { field: 'team_id', headerName: 'ID команды', type: 'number', width: 70 },
    { field: 'is_head', headerName: 'Хед команды', type: 'boolean', width: 100 },
    { field: 'registered_at', headerName: 'Дата регистрации', width: 150 },
    { field: 'last_auth', headerName: 'Дата последней авторизации', width: 150 },
    { field: 'wallet_balance', headerName: 'Баланс', type: 'number', width: 130, renderCell: (params) => params.row.wallet ? params.row.wallet.balance : false },
    { field: 'wallet_currency', headerName: 'Валюта', width: 130, renderCell: (params) => params.row.wallet ? params.row.wallet.currency : false },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 200,
      renderCell: (params) => (
        params.row.role_id === 0 ?
          <Button variant="contained" color="success" onClick={() => handleActivate(params.row.id)}>Активировать</Button>
          :
          <Button variant="contained" onClick={() => handleEdit(params.row)}>Редактировать</Button>
      ),
    },
  ];

  return (
    <>
      <CSSTransition
        in={showAlert}
        timeout={300}
        classNames="alert"
        unmountOnExit
      >
        <Alert variant="filled" severity={alert.severity}>
          {alert.message}
        </Alert>
      </CSSTransition>

      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 50, 100]}
      />

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {selectedUser ? `Редактирование пользователя: ${selectedUser.name}` : 'Выберите пользователя для редактирования'}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSave}>
              Сохранить
            </Button>
          </Toolbar>
        </AppBar>
        <div>
          {selectedUser && (
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                height: '90vh',
                display: 'flex',
                alignItems: 'center'
              }}
              noValidate
              autoComplete="off"
            >
              <Container maxWidth="md">
                <TextField
                  id="telegram_id"
                  label="Telegram ID"
                  value={formData.telegram_id}
                  InputProps={{
                    readOnly: true,
                  }}
                  onChange={handleChange}
                />
                <TextField
                  id="name"
                  label="Имя"
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  required
                  id="username"
                  label="Имя пользователя"
                  value={formData.username}
                  onChange={handleChange}
                />
                <TextField
                  id="phone"
                  label="Телефон"
                  type="number"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <TextField
                  id="role_id"
                  select
                  label="Роль"
                  value={formData.role_id}
                  onChange={handleChange}
                >
                  {roles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                {selectedUser?.wallet ? (
                  <>
                    <TextField
                      id="balance"
                      label="Wallet Balance"
                      value={selectedUser.wallet.balance}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      id="currency"
                      label="Currency"
                      value={selectedUser.wallet.currency}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleCreateWallet}>
                    Создать кошелек
                  </Button>
                )}
              </Container>
            </Box>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default Users;
