import * as React from 'react';
import axios from '../axiosConfig';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';


interface TeamProps {
  setIsLoading: (isLoading: boolean) => void;
}

interface Users {
  id: number;
  telegram_id: number;
  name: string;
  username: string;
  is_head: boolean;
}

interface Team {
  id: number;
  name: string;
}

interface TeamWithUsers extends Team {
  users: Users[];
}

function Row(props: { row: TeamWithUsers; onEdit: (team: Team) => void }) {
  const { row, onEdit } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>
          <IconButton aria-label="edit" onClick={() => onEdit(row)}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Пользователи
              </Typography>
              <Table size="small" aria-label="products">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Телеграм ID</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Имя пользователя</TableCell>
                    <TableCell>Лидер</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.telegram_id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.is_head}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const Category: React.FC<TeamProps> = ({ setIsLoading }) => {
  const [teams, setTeams] = React.useState<TeamWithUsers[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [teamName, setTeamName] = React.useState('');
  const [currentTeam, setCurrentTeam] = React.useState<Team | null>(null);

  React.useEffect(() => {
    setIsLoading(true)
    const fetchTeams = async () => {
      try {
        const teamResponse = await axios.get('/teams');
        const teamsData = teamResponse.data.data;

        const teamWithUsersPromises = teamsData.map(async (team: Team) => {
          const usersResponse = await axios.get(`/teams/specific?team_id=${team.id}`);
          const usersData = usersResponse.data.data.users;

          return {
            ...team,
            products: usersData,
          };
        });

        const teamsWithUsers = await Promise.all(teamWithUsersPromises);
        setTeams(teamsWithUsers);
      } catch (error) {
        console.error('Ошибка при загрузке команд и пользователей:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [setIsLoading]);

  const handleEdit = (team: Team) => {
    setCurrentTeam(team);
    setTeamName(team.name);
    setDialogTitle('Редактировать команду');
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setCurrentTeam(null);
    setTeamName('');
    setDialogTitle('Создать команду');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      if (currentTeam) {
        // Обновление категории
        await axios.patch('/teams', {
          id: currentTeam.id,
          name: teamName
        });
      } else {
        // Создание новой категории
        await axios.post('/teams', {
          name: teamName
        });
      }
      const teamResponse = await axios.get('/teams');
      const teamsData = teamResponse.data.data;

      const teamWithUsersPromises = teamsData.map(async (team: Team) => {
        const usersResponse = await axios.get(`/teams/specific?team_id=${team.id}`);
        const usersData = usersResponse.data.data.users;

        return {
          ...team,
          products: usersData,
        };
      });

      const teamsWithUsers = await Promise.all(teamWithUsersPromises);
      setTeams(teamsWithUsers);
    } catch (error) {
      console.error('Ошибка при сохранении категории:', error);
    } finally {
      handleClose();
    }
  };

  return (
    <React.Fragment>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreate}>
        Создать
      </Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell>Команда</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <Row key={team.id} row={team} onEdit={handleEdit} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Название категории"
            type="text"
            fullWidth
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleSave} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Category;

// export {}