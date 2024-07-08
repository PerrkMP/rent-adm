import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Box sx={{ width: '100%', maxWidth: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h2" gutterBottom>
        Ошибка 404.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Страница не найдена.
      </Typography>
      <Typography variant="overline" display="block" gutterBottom>
        вернуться в <Link to="/products">каталог</Link>
      </Typography>
    </Box>
  );
}