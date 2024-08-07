import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Title from '../components/Title';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { axisClasses, LineChart } from '@mui/x-charts';
import { ChartsTextStyle } from '@mui/x-charts/ChartsText';
import axios from '../axiosConfig';
import {useNavigate} from "react-router-dom";

interface HomeProps {
  setIsLoading: (isLoading: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ setIsLoading }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios.get('/transactions')
      .then(response => {
        const data = response.data.data;
        setTransactions(data);

        const paymentDeposits = data
          .filter((transaction: any) => transaction.type === 'payment' && transaction.status === 'success' && transaction.payment_method_id !== 2)
          .reduce((acc: number, transaction: any) => acc + transaction.amount, 0);

        const refillDeposits = data
          .filter((transaction: any) => transaction.type === 'refill')
          .reduce((acc: number, transaction: any) => acc + transaction.amount, 0);

        setTotalDeposits(paymentDeposits + refillDeposits);
      })
      .catch(error => {
        if (error.response.status === 401) {
          navigate('/login');
        } else if (error.response.status === 403) {
          navigate('/access-denied');
        } else {
          console.error('Error fetching transactions:', error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setIsLoading, navigate]);

  const recentTransactions = transactions.slice(0, 5);

  const formatPaymentMethod = (method: string) => {
    return method.includes('_') ? method.split('_')[0] : method;
  };

  const formatTransactionType = (type: string) => {
    return type === 'payment' ? 'Оплата' : 'Пополнение';
  };

  const getMonthlyData = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(now.getFullYear(), now.getMonth(), day);
      const formattedDate = date.toISOString().split('T')[0];
      const transactionsForDay = transactions.filter(t => t.created_at.split('T')[0] === formattedDate);
      const totalAmountForDay = transactionsForDay.reduce((acc, t) => acc + t.amount, 0);
      data.push({
        time: formattedDate,
        amount: totalAmountForDay || 0,
      });
    }

    return data;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Title>Monthly Transaction Dynamics</Title>
          <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
            <LineChart
              dataset={getMonthlyData()}
              margin={{
                top: 16,
                right: 20,
                left: 70,
                bottom: 30,
              }}
              xAxis={[
                {
                  scaleType: 'point',
                  dataKey: 'time',
                  tickNumber: 5,
                  tickLabelStyle: { fill: '#000' } as ChartsTextStyle,
                },
              ]}
              yAxis={[
                {
                  label: 'Amount ($)',
                  labelStyle: { fill: '#000' } as ChartsTextStyle,
                  tickLabelStyle: { fill: '#000' } as ChartsTextStyle,
                  max: Math.max(...getMonthlyData().map(d => d.amount)) + 500,
                  tickNumber: 5,
                },
              ]}
              series={[
                {
                  dataKey: 'amount',
                  showMark: false,
                  color: '#1976d2',
                },
              ]}
              sx={{
                [`.${axisClasses.root} line`]: { stroke: '#000' },
                [`.${axisClasses.root} text`]: { fill: '#000' },
                [`& .${axisClasses.left} .${axisClasses.label}`]: {
                  transform: 'translateX(-25px)',
                },
              }}
            />
          </div>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <Title>Recent Deposits</Title>
          <Typography component="p" variant="h4">
            ${totalDeposits.toFixed(2)}
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            {new Date().toLocaleDateString()}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Title>Recent Transactions</Title>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Payer</TableCell>
                <TableCell>Initiator</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>{transaction.payer.username}</TableCell>
                  <TableCell>{transaction.initiator}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{formatPaymentMethod(transaction.payment_method.name)}</TableCell>
                  <TableCell>{formatTransactionType(transaction.type)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Link color="primary" href="#" sx={{ mt: 3 }}>
            View all
          </Link>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Home;
