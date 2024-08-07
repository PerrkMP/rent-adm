import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import {useNavigate} from "react-router-dom";
import jwt from "jsonwebtoken";
import ListItemText from "@mui/material/ListItemText";

interface JwtPayload {
  role_id: number;
}

const token = localStorage.getItem('token');
const { role_id } = token ? (jwt.decode(token) as JwtPayload) : { role_id: 0 };

interface ProductsProps {
  setIsLoading: (isLoading: boolean) => void;
}

const Transition = React.forwardRef(function Transition(
  props: { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Product {
  id: number;
  name: string;
  image_url: string;
  description: string;
  category_name: string | null;
  category_id: number | null;
  price: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

const Products: React.FC<ProductsProps> = ({ setIsLoading }) => {
  const [rows, setRows] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', image_url: '', description: EditorState.createEmpty(), category_id: '', price: 0 });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' | undefined }>({ message: '', severity: undefined });
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    axios.get('/products')
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

    axios.get('/products/category')
      .then(response => {
        if (response.status === 200) {
          setCategories(response.data.data);
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

  const handleClickOpen = (product: Product | null) => {
    setSelectedProduct(product);
    setFormData({
      name: product?.name || '',
      image_url: product?.image_url || '',
      description: product ? EditorState.createWithContent(convertFromRaw(JSON.parse(product.description))) : EditorState.createEmpty(),
      category_id: product?.category_id ? product.category_id.toString() : '',
      price: product?.price || 0,
    });
    setIsEditMode(!!product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleCategoryDialogOpen = () => {
    setCategoryDialogOpen(true);
  };

  const handleCategoryDialogClose = () => {
    setCategoryDialogOpen(false);
  };

  const handleSave = async () => {
    try {
      const description = JSON.stringify(convertToRaw(formData.description.getCurrentContent()));
      if (isEditMode) {
        await axios.patch(`/products`, {
          id: selectedProduct!.id,
          name: formData.name,
          image_url: formData.image_url,
          description: description,
          price: formData.price,
        });
      } else {
        await axios.post('/products', {
          name: formData.name,
          image_url: formData.image_url,
          description: description,
          price: formData.price,
        });
      }
      // Перезагружаем данные
      const response = await axios.get('/products');
      setRows(response.data.data);
      handleClose();
    } catch (error) {
      console.error('Ошибка при сохранении продукта:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      category_id: e.target.value,
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.put('/storage/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.status === 'success') {
          setFormData((prevFormData) => ({
            ...prevFormData,
            image_url: response.data.data.image_url,
          }));
        }
      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
    }
  };

  const handleAddToCategory = async () => {
    try {
      const selectedProducts = selectionModel.map((id) => ({
        product_id: id,
        category_id: selectedCategoryId,
      }));

      await Promise.all(
        selectedProducts.map((product) =>
          axios.patch('/products/change/category', {
            category_id: product.category_id,
            product_id: product.product_id,
          })
        )
      );

      // Перезагружаем данные
      const response = await axios.get('/products');
      setRows(response.data.data);
      handleCategoryDialogClose();
    } catch (error) {
      console.error('Ошибка при добавлении в категорию:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Название', width: 130 },
    { field: 'description', headerName: 'Описание', width: 130 },
    { field: 'category_name', headerName: 'Название категории', width: 130 },
    { field: 'category_id', headerName: 'ID категории', type: 'number', width: 90 },
    { field: 'price', headerName: 'Цена', type: 'number', width: 90 },
    { field: 'created_at', headerName: 'Дата создания', width: 160 },
    {
      field: 'action',
      headerName: 'Действие',
      sortable: false,
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Button variant="outlined" onClick={() => handleClickOpen(params.row as Product)}>
          Редактировать
        </Button>
      ),
    },
  ];

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setFormData({ ...formData, description: newState });
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style: string) => {
    setFormData({ ...formData, description: RichUtils.toggleInlineStyle(formData.description, style) });
  };

  return (
    <React.Fragment>
      {role_id >= 3 && (
        <div>
          <Button variant="outlined" onClick={() => handleClickOpen(null)} sx={{ mb: 2 }}>
            Создать новый продукт
          </Button>
          <Button variant="outlined" onClick={handleCategoryDialogOpen} sx={{ ml: 2, mb: 2 }}>
            Добавить в категорию
          </Button>
        </div>
      )}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => setSelectionModel(newSelection)}
        />
      </div>
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
              {isEditMode ? `Редактирование ${selectedProduct?.name}` : 'Создание нового продукта'}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSave}>
              Сохранить
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          noValidate
          autoComplete="off"
        >
          <Container maxWidth="md">
            {/* Первая секция: Загрузка изображения */}
            <Box sx={{ m: 1, width: '50ch' }}>
              <Button
                variant="contained"
                component="label"
              >
                Загрузить изображение
                <input
                  type="file"
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
              {formData.image_url && (
                <Box mt={2}>
                  <TextField
                    id="image_url"
                    label="URL изображения"
                    value={formData.image_url}
                    fullWidth
                    margin="normal"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Вторая секция: Основные поля */}
            <TextField
              required
              id="name"
              label="Наименование"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              required
              id="price"
              label="Цена"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />

            {/* Третья секция: Описание с поддержкой Markdown */}
            <Box sx={{ m: 1, width: '100%' }}>
              <Button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('BOLD'); }}>Bold</Button>
              <Button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('ITALIC'); }}>Italic</Button>
              <Button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('UNDERLINE'); }}>Underline</Button>
              <Button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('STRIKETHROUGH'); }}>Strikethrough</Button>
              <Button onMouseDown={(e) => { e.preventDefault(); toggleInlineStyle('CODE'); }}>Code</Button>
              <Box sx={{ border: '1px solid #ddd', padding: 2, minHeight: '400px' }}>
                <Editor
                  editorState={formData.description}
                  handleKeyCommand={handleKeyCommand}
                  onChange={(newState) => setFormData({ ...formData, description: newState })}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      </Dialog>
      <Dialog open={categoryDialogOpen} onClose={handleCategoryDialogClose}>
        <DialogTitle>Выберите категорию</DialogTitle>
        <DialogContent>
          <TextField
            id="category_id"
            select
            label="Категория"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            fullWidth
            margin="normal"
          >
            {categories.map((option) => (
              <MenuItem key={option.id} value={option.id.toString()}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCategoryDialogClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleAddToCategory} color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Products;
