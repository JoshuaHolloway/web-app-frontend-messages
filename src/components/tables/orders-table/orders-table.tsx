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
// import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import type { DateRangeTuple } from '@src/code/functions/dates/date-index';
import { index2DateTime, months } from '@src/code/functions/dates/date-index';
import { twentyFour2Twelve, zeroPad } from '@src/code/functions/dates/format-date';
import { toDollarsStr } from '@src/code/functions/money/money';
import { useHttpClient } from '@src/code/hooks/http-hook';
import { order_status_map } from '@src/code/types/Order';
import type { OrdersUsers } from '@src/code/types/OrdersUsers';
import CalendarDateRange from '@src/components/calendar-date-range/calendar-date-range';
import RadioButtonsGroup from '@src/components/radio/radio-sort';
import OrderStatus from '@src/components/tables/orders-table/order-status/order-status';
import colors from '@src/style/colors.module.scss';
import Pagination from '../table-pagination/table-pagination';
import css from './orders-table.module.scss';

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

const StyledTableRowOuter = styled(TableRow)((props: { open?: boolean; active_row?: number; theme?: any }) => ({
  '&:nth-of-type(4n+1), &:nth-of-type(4n-2)': {
    backgroundColor: props.open ? 'AliceBlue' : props.theme.palette.action.hover,
  },

  // hide last border:
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// ==============================================

// -This is not the standard Product interface
interface Product {
  order_id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  category: number;
}

// ==============================================

function Row(props: {
  row: OrdersUsers;
  view_full_order_id: boolean;
  row_idx: number;
  active_row: number;
  setActiveRow: any;
}) {
  // ------------------------------------------

  const { row } = props;
  const [open, setOpen] = useState(false);

  const [products_for_order, setProductsForOrder] = useState<Product[]>([]);

  const { sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);
  // const loadingCtx = useContext(LoadingContext);
  const notificationCtx = useContext(NotificationContext);

  // --------------------------------------------

  // const [y, m, d] = index2Date(row.date_index);
  // const [hr, min] = index2Time(row.time_index);
  const { y, m, d, hr, min } = index2DateTime(row.date_time_index);
  const { hr_12, period } = twentyFour2Twelve(hr);

  // --------------------------------------------

  const dropdownHandler = async () => {
    // console.log('Fetching products from order, props.order_id: ', row.order_id);

    if (open === false) {
      // -The arrow was clicked when open=false => this row is expanded and all others are closed involuntarily
      setOpen(true);
      props.setActiveRow(props.row_idx);

      try {
        // loadingCtx.startLoading(1.2);
        // notificationCtx.begin({ message: 'logging in...' });

        // -Get all products for a specific order
        // [GET] /api/orders/:id/products
        const products: Product[] = await sendRequest(`/api/orders/${row.order_id}/products`, 'GET', null, {
          'Content-Type': 'application/json',
          Authorization: authCtx.token,
        });
        // console.log('products', products);
        setProductsForOrder(products);

        // loadingCtx.endLoading();
      } catch (err: any) {
        notificationCtx.endError({ message: err.message });
        // loadingCtx.endLoading();
        console.log('catch, error: ', err.message);
      }
    } else {
      // -The arrow was clicked when open=true => ALL of the rows will be collapsed afterwards.
      props.setActiveRow(-1); // this triggers useEffect(, [props.active_num]) on ALL rows (including this one) and sets open = true
    }
  };

  // --------------------------------------------

  useEffect(() => {
    if (props.row_idx !== props.active_row) {
      setOpen(false);
    }
  }, [props.active_row]);

  // --------------------------------------------

  return (
    <>
      <StyledTableRowOuter
        className="message-row"
        sx={{
          '&:nth-of-type(4n+1), &:nth-of-type(4n-2)': {
            backgroundColor: open ? 'AliceBlue' : 'rgb(245, 245, 245)', //props.theme.palette.action.hover,
          },
          backgroundColor: open ? 'AliceBlue' : '',
          '&.message-row * ': {
            color: !open && props.active_row !== -1 ? 'lightgray' : '',
          },

          // hide last border:
          '&:last-child td, &:last-child th': {
            border: 0,
          },
        }}
      >
        <TableCell sx={{ width: '50px' }}>
          <IconButton aria-label="expand row" size="small" onClick={dropdownHandler}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Link href={`/admin/orders/${row.uuid}`}>{props.view_full_order_id ? row.uuid : row.uuid_short}</Link>
        </TableCell>
        <TableCell align="center">
          <OrderStatus status={row.status} />
          {order_status_map[row.status]}
        </TableCell>
        <TableCell align="right">
          <Link href={`/admin/users/${row.user_id}`}>{row.username}</Link>
        </TableCell>
        <TableCell align="right">{toDollarsStr(row.total)}</TableCell>
        <TableCell align="right">
          {/* {zero2oneBasedMonth(row.date)} <span style={{ color: 'silver' }}>@</span> {formatTime_12hr(row.time)} */}
          {row.date_time}
        </TableCell>

        <TableCell align="right">{`${months[m]} ${d}, ${y}`}</TableCell>
        <TableCell align="right">{`${hr_12}:${zeroPad(min)} ${period}`}</TableCell>

        <TableCell align="right">{row.first_name}</TableCell>
        <TableCell align="right">{row.last_name}</TableCell>
      </StyledTableRowOuter>
      <StyledTableRowOuter sx={{ '&, & > *': { background: open ? 'AliceBlue' : '' } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Order Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Product Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products_for_order.map((product: Product, idx: number) => (
                    <StyledTableRow key={idx}>
                      <TableCell component="th" scope="row">
                        <Link href={`/admin/products/${product.product_id}`}>{product.product_name}</Link>
                      </TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell align="right">{toDollarsStr(product.product_price)}</TableCell>
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

export default function OrdersTable() {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);

  // All rows in current page:
  const [orders, setOrders] = useState<OrdersUsers[]>([]);

  // UUID vs. short-UUID
  const [view_full_order_id, setViewFullOrderID] = useState(false);

  // Active dropdown:
  const [active_row, setActiveRow] = useState<number>(-1); // -1 => ALL rows have open=false

  // Pagination:
  const [page, setPage] = useState(1); // 1-index for top pagination, bottom one -1 for zero-index, and -1 in HTTP request to set offset to 0 on page 1 for SQL query
  const [row_count, setRowCount] = useState(0);
  const [rows_per_page, setRowsPerPage] = useState(10);

  // -Radio button state (filter criteria):
  const filter_options = ['error', 'tentative', 'pending', 'complete', 'all'];
  const [filter_criterion, setFilterCriterion] = useState(filter_options[filter_options.length - 1]);
  const getFilterIndex = (): number => {
    const filter_map: { [key: string]: number } = { error: 0, tentative: 1, pending: 2, complete: 3, all: 4 };
    const filter_index = filter_map[filter_criterion];
    return filter_index;
  };

  // -Radio button state (sort criteria):
  const sort_options = ['date & time', 'name (last)', 'name (first)', 'username', 'total'];
  const [sort_criterion, setSortCriterion] = useState(sort_options[0]);
  const getSortIndex = (): number => {
    const sort_map: { [key: string]: number } = {
      'date & time': 0,
      'name (last)': 1,
      'name (first)': 2,
      username: 3,
      total: 4,
    };
    const sort_index = sort_map[sort_criterion];
    return sort_index;
  };

  // -Radio button state (sort-type: {asc, desc):
  const sort_types = ['desc', 'asc'];
  const [sort_type, setSortType] = useState(sort_types[0]);

  // -Date range:
  const [date_range, setDateRange] = useState<DateRangeTuple>([NaN, NaN]);

  // --------------------------------------------

  const getPage = async () => {
    console.log('Fetching orders');
    // NOTE: the HTTP request is being made twice!
    // TODO: Fix this shit!
    if (!isNaN(date_range[0]) && !isNaN(date_range[1])) {
      try {
        // loadingCtx.startLoading();
        // notificationCtx.begin({ message: 'logging in...' });

        console.log('[GET] /api/orders/:rows_per_page/:page/:status/:date_lo/:date_hi/:sort/:sort_type');
        const { rows, row_count: num_rows }: { rows: OrdersUsers[]; row_count: number } = await sendRequest(
          `/api/orders/${rows_per_page}/${page - 1}/${getFilterIndex()}/${date_range[0]}/${
            date_range[1]
          }/${getSortIndex()}/${sort_type}`, // to have endpoing /api/orders/:order_id/products (due to same number of path-params) we need to encode rows_per_page and page into one string during request.
          'GET',
          null,
          {
            'Content-Type': 'application/json',
            Authorization: authCtx.token,
          }
        );
        console.log('row_count: ', num_rows);
        setRowCount(Number(num_rows)); // apparently, row_count actually comes in as a string!
        setOrders(rows);

        // authCtx.login(data.token);
        // notificationCtx.endSuccess({ message: 'successfully logged in!' });
        // loadingCtx.endLoading();
      } catch (err: any) {
        // notificationCtx.endError({ message: err.message });
        // loadingCtx.endLoading();
        console.log('catch, error: ', err.message);
      }
    }
  };

  // --------------------------------------------

  useEffect(() => {
    // -Don't do this on page change
    setPage(1); // -Change pagination to first page
  }, [rows_per_page, filter_criterion, sort_criterion, sort_type, date_range]);

  // --------------------------------------------

  useEffect(() => {
    console.log(
      `page: ${page}\nrows_per_page: ${rows_per_page}\nfilter_criterion: ${filter_criterion}\nsort_critera: ${sort_criterion}\nsort_type: ${sort_type}, date_range: ${date_range}`
    );

    setActiveRow(-1); // -All dropdowns closed
    getPage(); // -Drop an HTTP request up on this bitch
  }, [page, rows_per_page, filter_criterion, sort_criterion, sort_type, date_range]);

  // --------------------------------------------

  return (
    <>
      {/* Radio-Buttons / Date Range */}
      <div className={css.filter_container}>
        <div className={css.radio_container}>
          <RadioButtonsGroup
            options={filter_options}
            option={filter_criterion}
            setOption={setFilterCriterion}
            title="Order Status:"
          />

          <RadioButtonsGroup
            options={sort_options}
            option={sort_criterion}
            setOption={setSortCriterion}
            title="Sort By:"
          />

          <RadioButtonsGroup options={sort_types} option={sort_type} setOption={setSortType} title="Sort Type:" />
        </div>

        <CalendarDateRange setDateRange={setDateRange} />
      </div>

      {/* Orders Table */}
      <TableContainer component={Paper} sx={{ minWidth: '1000px' }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell
                onClick={() => setViewFullOrderID((prev) => !prev)}
                style={{ color: colors.primary, cursor: 'pointer' }}
              >
                {view_full_order_id ? 'Order Number (full)' : 'Order Number (short)'}
              </TableCell>

              <TableCell align="center">Status</TableCell>

              <TableCell align="right" className={sort_criterion === sort_options[3] ? css.active_sort_criterion : ''}>
                Username
                {sort_type === sort_types[0] && sort_criterion === sort_options[3] && (
                  <svg width="16" height="16" fill="currentColor" className="bi bi-arrow-up" viewBox="0 0 16 16">
                    <path
                      fillRule="evenodd"
                      d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
                    />
                  </svg>
                )}
                {sort_type === sort_types[1] && sort_criterion === sort_options[3] && (
                  <svg width="16" height="16" fill="currentColor" className="bi bi-arrow-down" viewBox="0 0 16 16">
                    <path
                      fillRule="evenodd"
                      d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
                    />
                  </svg>
                )}
              </TableCell>
              <TableCell align="right" className={sort_criterion === sort_options[4] ? css.active_sort_criterion : ''}>
                Total
              </TableCell>
              <TableCell align="right" className={sort_criterion === '' ? css.active_sort_criterion : ''}>
                DEBUG
              </TableCell>
              <TableCell align="right" className={sort_criterion === sort_options[0] ? css.active_sort_criterion : ''}>
                Date
              </TableCell>
              <TableCell align="right" className={sort_criterion === sort_options[0] ? css.active_sort_criterion : ''}>
                Time
              </TableCell>
              <TableCell align="right" className={sort_criterion === sort_options[1] ? css.active_sort_criterion : ''}>
                First Name
              </TableCell>
              <TableCell align="right" className={sort_criterion === sort_options[2] ? css.active_sort_criterion : ''}>
                Last Name
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order: OrdersUsers, idx) => (
              <Row
                key={order.uuid_short}
                row={order}
                view_full_order_id={view_full_order_id}
                row_idx={idx}
                active_row={active_row}
                setActiveRow={setActiveRow}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        page={page}
        setPage={setPage}
        rows_per_page={rows_per_page}
        setRowsPerPage={setRowsPerPage}
        row_count={row_count}
      />
    </>
  );

  // ------------------------------------------
}

// ==============================================
