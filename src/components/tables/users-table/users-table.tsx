import { useState, useEffect, useContext } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import AuthContext from '@src/code/context/auth-context';
import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import { formatTime_12hr, zero2oneBasedMonth } from '@src/code/functions/dates/format-date';
import { toDollarsStr } from '@src/code/functions/money/money';
import { useHttpClient } from '@src/code/hooks/http-hook';
// import colors from '@src/style/colors.module.scss';

// ==============================================

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableRowOuter = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(4n+1), &:nth-of-type(4n-2)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// ==============================================

interface Order {
  id: number;
  uuid: string;
  uuid_short: string;
  total: number;
  user_id: number;
  date: string;
  time: string;
  updated_at: string;
  status: string;
}

interface User {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
  user_id: number;
}

// ==============================================

function Row(props: { row: User }) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const [orders_for_user, setOrdersForUser] = useState<Order[]>([]);

  const { sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const loadingCtx = useContext(LoadingContext);
  const notificationCtx = useContext(NotificationContext);

  // --------------------------------------------

  const dropdownHandler = async () => {
    // console.log('Fetching products from order, props.order_id: ', row.user_id);

    if (open === false) {
      try {
        loadingCtx.startLoading(1.2);
        // notificationCtx.begin({ message: 'logging in...' });

        // [GET] /api/orders/:id  orders-model.js -> findById(:id)  => [{order_id, product_name, product_price, quantity}]
        const orders = await sendRequest(`/api/orders/ordersForSpecificUser/${row.user_id}`, 'GET', null, {
          'Content-Type': 'application/json',
          Authorization: authCtx.token,
        });
        // console.log('orders', orders);
        setOrdersForUser(orders);

        setOpen(true);

        // authCtx.login(data.token);
        // notificationCtx.endSuccess({ message: 'successfully logged in!' });
        loadingCtx.endLoading();
      } catch (err: any) {
        notificationCtx.endError({ message: err.message });
        // loadingCtx.endLoading();
        console.log('catch, error: ', err.message);
      }
    } else {
      setOpen(false);
    }
  };

  // --------------------------------------------

  return (
    <>
      <StyledTableRowOuter sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={dropdownHandler}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.username}
        </TableCell>
        <TableCell align="right">{row.first_name}</TableCell>
        <TableCell align="right">{row.last_name}</TableCell>
        <TableCell align="right">{row.role}</TableCell>
      </StyledTableRowOuter>
      <StyledTableRowOuter>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Order Placed At</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders_for_user.map((order: Order) => (
                    <StyledTableRow key={order.uuid_short}>
                      <TableCell component="th" scope="row">
                        <Link href={`/admin/orders/${order.uuid}`}>{order.uuid_short}</Link>
                      </TableCell>
                      <TableCell>
                        {zero2oneBasedMonth(order.date)} <span style={{ color: 'silver' }}>@</span>{' '}
                        {formatTime_12hr(order.time)}
                      </TableCell>
                      <TableCell align="right">{toDollarsStr(order.total)}</TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </StyledTableRowOuter>
    </>
  );
}

// ==============================================

// ==============================================

export default function UsersTable() {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();

  const authCtx = useContext(AuthContext);

  const [users, setUsers] = useState([]);

  // --------------------------------------------

  useEffect(() => {
    (async () => {
      // console.log('Fetching users');

      try {
        // loadingCtx.startLoading();
        // notificationCtx.begin({ message: 'logging in...' });

        const data = await sendRequest('/api/users', 'GET', null, {
          'Content-Type': 'application/json',
          Authorization: authCtx.token,
        });
        // console.log('data: ', data);
        setUsers(data);

        // authCtx.login(data.token);
        // notificationCtx.endSuccess({ message: 'successfully logged in!' });
        // loadingCtx.endLoading();
      } catch (err: any) {
        // notificationCtx.endError({ message: err.message });
        // loadingCtx.endLoading();
        console.log('catch, error: ', err.message);
      }
    })();
  }, []);

  // --------------------------------------------

  return (
    <TableContainer component={Paper} sx={{ minWidth: '1000px' }}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Username</TableCell>
            <TableCell align="right">First Name</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: User) => (
            <Row key={user.user_id} row={user} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // --------------------------------------------
}

// ==============================================
