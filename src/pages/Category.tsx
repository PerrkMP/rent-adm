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
import {convertFromRaw, Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {useNavigate} from "react-router-dom";
import {useState} from "react";


interface CategoryProps {
  setIsLoading: (isLoading: boolean) => void;
}

interface Product {
  id: number;
  name: string;
  image_url: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  price: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface CategoryWithProducts extends Category {
  products: Product[];
}

function Row(props: { row: CategoryWithProducts; onEdit: (category: Category) => void }) {
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
                Продукты
              </Typography>
              <Table size="small" aria-label="products">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell>Описание</TableCell>
                    <TableCell>Цена</TableCell>
                    <TableCell>Дата создания</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Editor
                          editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(product.description)))}
                          onChange={() => null}
                          readOnly
                         />
                      </TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.created_at}</TableCell>
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

const Category: React.FC<CategoryProps> = ({ setIsLoading }) => {
  const [categories, setCategories] = React.useState<CategoryWithProducts[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [categoryName, setCategoryName] = React.useState('');
  const [currentCategory, setCurrentCategory] = React.useState<Category | null>(null);
  const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' | undefined }>({ message: '', severity: undefined });
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    setIsLoading(true)
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get('/products/category');
        if (categoryResponse.status === 200) {
          const categoriesData = categoryResponse.data.data;

          const categoryWithProductsPromises = categoriesData.map(async (category: any) => {
            const productsResponse = await axios.get(`/products?category_id=${category.id}`);
            const productsData = productsResponse.data.data;

            return {
              ...category,
              products: productsData,
            };
          });

          const categoriesWithProducts = await Promise.all(categoryWithProductsPromises);
          setCategories(categoriesWithProducts);
          setAlert({ message: 'Категории и продукты успешно загружены', severity: 'success' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        } else {
          setAlert({ message: 'Неизвестная ошибка', severity: 'error' });
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2500);
        }
      } catch (error) {
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [setIsLoading, navigate]);

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setDialogTitle('Редактировать категорию');
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setCurrentCategory(null);
    setCategoryName('');
    setDialogTitle('Создать категорию');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      if (currentCategory) {
        // Обновление категории
        await axios.patch('/products/category', {
          id: currentCategory.id,
          name: categoryName
        });
      } else {
        // Создание новой категории
        await axios.post('/products/category', {
          name: categoryName
        });
      }
      // Обновление списка категорий после изменения
      const categoryResponse = await axios.get('/products/category');
      const categoriesData = categoryResponse.data.data;

      const categoryWithProductsPromises = categoriesData.map(async (category: Category) => {
        const productsResponse = await axios.get(`/products?category_id=${category.id}`);
        const productsData = productsResponse.data.data;

        return {
          ...category,
          products: productsData,
        };
      });

      const categoriesWithProducts = await Promise.all(categoryWithProductsPromises);
      setCategories(categoriesWithProducts);
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
              <TableCell>Категория</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <Row key={category.id} row={category} onEdit={handleEdit} />
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
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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