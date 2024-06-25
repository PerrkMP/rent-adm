// import * as React from 'react';
// import axios from '../axiosConfig';
// import Box from '@mui/material/Box';
// import Collapse from '@mui/material/Collapse';
// import IconButton from '@mui/material/IconButton';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import TextField from '@mui/material/TextField';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import EditIcon from '@mui/icons-material/Edit';
// import AddIcon from '@mui/icons-material/Add';
//
//
// interface TeamProps {
//   setIsLoading: (isLoading: boolean) => void;
// }
//
// interface Users {
//   id: number;
//   telegram_id: number;
//   name: string;
//   username: string;
//   is_head: boolean;
// }
//
// interface Team {
//   id: number;
//   name: string;
// }
//
// interface TeamWithUsers extends Team {
//   users: Users[];
// }
//
// function Row(props: { row: TeamWithUsers; onEdit: (team: Team) => void }) {
//   const { row, onEdit } = props;
//   const [open, setOpen] = React.useState(false);
//
//   return (
//     <React.Fragment>
//       <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
//         <TableCell>
//           <IconButton
//             aria-label="expand row"
//             size="small"
//             onClick={() => setOpen(!open)}
//           >
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>
//         <TableCell component="th" scope="row">
//           {row.id}
//         </TableCell>
//         <TableCell component="th" scope="row">
//           {row.name}
//         </TableCell>
//         <TableCell>
//           <IconButton aria-label="edit" onClick={() => onEdit(row)}>
//             <EditIcon />
//           </IconButton>
//         </TableCell>
//       </TableRow>
//       <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box sx={{ margin: 1 }}>
//               <Typography variant="h6" gutterBottom component="div">
//                 Пользователи
//               </Typography>
//               <Table size="small" aria-label="products">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>ID</TableCell>
//                     <TableCell>Телеграм ID</TableCell>
//                     <TableCell>Имя</TableCell>
//                     <TableCell>Имя пользователя</TableCell>
//                     <TableCell>Лидер</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {row.users.map((user) => (
//                     <TableRow key={user.id}>
//                       <TableCell>{user.id}</TableCell>
//                       <TableCell>{user.telegram_id}</TableCell>
//                       <TableCell>{user.name}</TableCell>
//                       <TableCell>{user.username}</TableCell>
//                       <TableCell>{user.is_head}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </React.Fragment>
//   );
// }
//
// const Category: React.FC<TeamProps> = ({ setIsLoading }) => {
//   const [teams, setTeams] = React.useState<TeamWithUsers[]>([]);
//   const [openDialog, setOpenDialog] = React.useState(false);
//   const [dialogTitle, setDialogTitle] = React.useState('');
//   const [teamName, setTeamName] = React.useState('');
//   const [currentTeam, setCurrentTeam] = React.useState<Team | null>(null);
//
//   React.useEffect(() => {
//     setIsLoading(true)
//     const fetchTeams = async () => {
//       try {
//         const categoryResponse = await axios.get('/products/category');
//         const categoriesData = categoryResponse.data.data;
//
//         const categoryWithProductsPromises = categoriesData.map(async (category: Category) => {
//           const productsResponse = await axios.get(`/products?category_id=${category.id}`);
//           const productsData = productsResponse.data.data;
//
//           return {
//             ...category,
//             products: productsData,
//           };
//         });
//
//         const categoriesWithProducts = await Promise.all(categoryWithProductsPromises);
//         setCategories(categoriesWithProducts);
//       } catch (error) {
//         console.error('Ошибка при загрузке категорий и продуктов:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//
//     fetchCategories();
//   }, [setIsLoading]);
//
//   const handleEdit = (category: Category) => {
//     setCurrentCategory(category);
//     setCategoryName(category.name);
//     setDialogTitle('Редактировать категорию');
//     setOpenDialog(true);
//   };
//
//   const handleCreate = () => {
//     setCurrentCategory(null);
//     setCategoryName('');
//     setDialogTitle('Создать категорию');
//     setOpenDialog(true);
//   };
//
//   const handleClose = () => {
//     setOpenDialog(false);
//   };
//
//   const handleSave = async () => {
//     try {
//       if (currentCategory) {
//         // Обновление категории
//         await axios.patch('/products/category', {
//           id: currentCategory.id,
//           name: categoryName
//         });
//       } else {
//         // Создание новой категории
//         await axios.post('/products/category', {
//           name: categoryName
//         });
//       }
//       // Обновление списка категорий после изменения
//       const categoryResponse = await axios.get('/products/category');
//       const categoriesData = categoryResponse.data.data;
//
//       const categoryWithProductsPromises = categoriesData.map(async (category: Category) => {
//         const productsResponse = await axios.get(`/products?category_id=${category.id}`);
//         const productsData = productsResponse.data.data;
//
//         return {
//           ...category,
//           products: productsData,
//         };
//       });
//
//       const categoriesWithProducts = await Promise.all(categoryWithProductsPromises);
//       setCategories(categoriesWithProducts);
//     } catch (error) {
//       console.error('Ошибка при сохранении категории:', error);
//     } finally {
//       handleClose();
//     }
//   };
//
//   return (
//     <React.Fragment>
//       <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreate}>
//         Создать
//       </Button>
//       <TableContainer component={Paper} sx={{ mt: 2 }}>
//         <Table aria-label="collapsible table">
//           <TableHead>
//             <TableRow>
//               <TableCell />
//               <TableCell>ID</TableCell>
//               <TableCell>Категория</TableCell>
//               <TableCell>Действия</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {categories.map((category) => (
//               <Row key={category.id} row={category} onEdit={handleEdit} />
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Dialog
//         open={openDialog}
//         onClose={handleClose}
//         aria-labelledby="form-dialog-title"
//       >
//         <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="name"
//             label="Название категории"
//             type="text"
//             fullWidth
//             value={categoryName}
//             onChange={(e) => setCategoryName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Отмена
//           </Button>
//           <Button onClick={handleSave} color="primary">
//             Сохранить
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </React.Fragment>
//   );
// }
//
// export default Category;

export {}