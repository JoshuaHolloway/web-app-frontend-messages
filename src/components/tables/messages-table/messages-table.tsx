import { useState, useEffect, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import DraftsIcon from '@mui/icons-material/Drafts';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LabelIcon from '@mui/icons-material/Label';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
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
import AuthContext from '@src/code/context/auth-context';
import LoadingContext from '@src/code/context/loading-context';
import NotificationContext from '@src/code/context/notification-context';
import type { DateRangeTuple } from '@src/code/functions/dates/date-index';
import { initializeDateRange } from '@src/code/functions/dates/date-index';
import { index2Date, index2DateTime, months } from '@src/code/functions/dates/date-index';
import { twentyFour2Twelve, zeroPad } from '@src/code/functions/dates/format-date';
import { useHttpClient } from '@src/code/hooks/http-hook';
// import type { MessageUser } from '@src/code/types/Message';
import type { MessageHttp } from '@src/code/types/MessageHttp';
import CalendarDateRange from '@src/components/calendar-date-range/calendar-date-range';
import Dropdown from '@src/components/dropdown/dropdown';
import Dropdown2 from '@src/components/dropdown/dropdown2';
import SortMenu from '@src/components/dropdown/sort-menu';
import Popover from '@src/components/popover/hover-popover';
import Pagination from '@src/components/tables/table-pagination-messages/table-pagination-messages';
import css from './messages-table.module.scss';
import Star from './star/star';
// import { toDollarsStr } from '@src/code/functions/money/money';
// import SpanningTable from '@src/components/tables/demo/row-spanning-table';
import Chip from '@mui/material/Chip';

// ==============================================

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// ==============================================

const StyledTableRowOuter = styled(TableRow)((props: { open?: any; active_row?: number; theme?: any }) => ({
  '&:nth-of-type(4n+1), &:nth-of-type(4n-2)': {
    backgroundColor: props.open ? 'AliceBlue' : 'rgb(245, 245, 245)', //props.theme.palette.action.hover,
  },

  // hide last border:
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// ==============================================

// ==============================================

function Row(p: {
  row: MessageHttp;
  row_idx: number;
  active_row: number;
  setActiveRow: any;
  unique_check_ids: any; // set
  setUniqueCheckIds: any;
  setAllUnchecked: any;
  all_checked: boolean;
  setAllChecked: any;
  all_unchecked: boolean;
  rows_per_page: number;
  // setMessages: any;
}) {
  const { row } = p;
  const [open, setOpen] = useState(false);
  const dropdownHandler = () => {
    if (open) {
      // -The arrow was clicked when open=true => ALL of the rows will be collapsed afterwards.
      p.setActiveRow(-1); // this triggers useEffect(, [props.active_num]) on ALL rows (including this one) and sets open = true
    } else {
      // -The arrow was clicked when open=false => this row is expanded and all others are closed involuntarily
      setOpen((prev) => !prev);
      p.setActiveRow(p.row_idx);
    }
  };

  // --------------------------------------------

  useEffect(() => {
    if (p.row_idx !== p.active_row) {
      setOpen(false);
    }
  }, [p.active_row]);

  // --------------------------------------------

  // const [y, m, d] = index2Date(row.date_index);
  // const [hr, min] = index2Time(row.time_index);
  const { y, m, d, hr, min } = index2DateTime(row.date_time_index);
  const { hr_12, period } = twentyFour2Twelve(hr);

  const [date_time, setDateTime] = useState<string>('');
  useEffect(() => {
    const t = new Date();
    // setToday({ y: t.getFullYear(), m: t.getMonth(), d: t.getDate() });

    if (t.getFullYear() === y && t.getMonth() === m && t.getDate() === d) {
      setDateTime(`${hr_12}:${zeroPad(min)} ${period}`);
    } else {
      setDateTime(`${months[m]} ${d}, ${y}`);
    }
  }, []);

  // --------------------------------------------

  const [checked, setChecked] = useState(false);
  const handleCheck = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const ch = event.target.checked;

    if (ch) {
      p.setUniqueCheckIds((prev: any) => prev.add(id) /* returns the set after adding element */);
      p.setAllUnchecked(false);
    } else {
      uncheckRow();

      // -If at least one is unchecked, then all_checked is false
      p.setAllChecked(false);
    }

    setChecked(event.target.checked);
    console.log('id: ', id);
  };

  const uncheckRow = () => {
    p.setUniqueCheckIds((prev: any) => {
      const new_set = new Set(prev);
      new_set.delete(row.message_id);
      return new_set;
    });
    setChecked(false);
  };

  // -Check all rows:
  useEffect(() => {
    console.log('p.all_checked', p.all_checked);
    if (p.all_checked === true) {
      p.setUniqueCheckIds((prev: any) => prev.add(row.message_id) /* returns the set after adding element */);
      setChecked(true);
    }
  }, [p.all_checked]);

  // Uncheck all rows:
  useEffect(() => {
    if (p.all_unchecked === true) {
      uncheckRow();
    }
  }, [p.all_unchecked]);

  // --------------------------------------------

  return (
    <>
      <StyledTableRowOuter
        className="message-row"
        sx={{
          '&:nth-of-type(4n+1), &:nth-of-type(4n-2)': {
            backgroundColor: open ? 'AliceBlue' : 'rgb(245, 245, 245)', //p.theme.palette.action.hover,
          },
          backgroundColor: open ? 'AliceBlue' : '',
          '&.message-row * ': {
            color: !open && p.active_row !== -1 ? 'lightgray' : '',
          },

          // hide last border:
          '&:last-child td, &:last-child th': {
            border: 0,
          },
        }}
      >
        <TableCell align="center" sx={{ width: '50px' }}>
          <Checkbox
            checked={checked}
            onChange={handleCheck(row.message_id)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </TableCell>

        <TableCell align="center" sx={{ width: '30px' }}>
          {/* {<Star starred={row.starred} id={row.message_id} setMessages={row.setMessages} />} */}
        </TableCell>

        <TableCell sx={{ width: '50px' }}>
          <IconButton aria-label="expand row" size="small" onClick={dropdownHandler}>
            {open ? (
              <KeyboardArrowUpIcon />
            ) : (
              // <KeyboardArrowDownIcon sx={{ background: !open && props.active_row !== -1 ? 'lightgray' : '' }} />
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>

        <TableCell align="left" sx={{ color: open ? 'transparent' : '' }}>
          {row.category !== null && <Chip label={row.category} variant="outlined" />}
          {row.message?.length > 10 ? `${row.message?.slice(0, 10)}...` : row.message}
        </TableCell>

        <TableCell align="right">{row.date_time}</TableCell>
        {/* <TableCell align="right">{row.status}</TableCell> */}
        <TableCell align="right">{row.username}</TableCell>
        <TableCell align="right">
          {row.first_name}
          {row.last_name}
        </TableCell>
      </StyledTableRowOuter>
      <StyledTableRowOuter sx={{ '& > *': { background: open ? 'AliceBlue' : '' } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Full Message
              </Typography>
              <p>{row.message}</p>
            </Box>
          </Collapse>
        </TableCell>
      </StyledTableRowOuter>
    </>
  );
}

// ==============================================

export default function MessagesTable(props: {
  filter_options: string[];
  filter_criterion: string;
  setFilterCriterion: any;
  messages: any;
  // setMessages: any;
}) {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const loadingCtx = useContext(LoadingContext);

  // --------------------------------------------

  // Active dropdown:
  const [active_row, setActiveRow] = useState<number>(-1); // -1 => ALL rows have open=false

  // --------------------------------------------

  // Pagination:
  const [page, setPage] = useState(1); // 1-index for top pagination, bottom one -1 for zero-index, and -1 in HTTP request to set offset to 0 on page 1 for SQL query
  const [row_count, setRowCount] = useState(0);
  const [rows_per_page, setRowsPerPage] = useState(10);

  // --------------------------------------------

  // -Radio button state (filter criteria):
  // const filter_options = ['unread', 'read', 'trash'];
  // const [filter_criterion, setFilterCriterion] = useState(filter_options[0]);
  const getFilterIndex = (filter_criterion: string): number => {
    const filter_map: { [key: string]: number } = { unread: 0, read: 1, trash: 2 };
    const filter_index = filter_map[filter_criterion];
    return filter_index;
  };

  // --------------------------------------------

  // -Radio button state (sort criteria):
  const sort_options = ['date & time', 'name (last)', 'name (first)', 'username'];
  const [sort_criterion, setSortCriterion] = useState(sort_options[0]);
  const getSortIndex = (): number => {
    const sort_map: { [key: string]: number } = {
      'date & time': 0,
      'name (last)': 1,
      'name (first)': 2,
      username: 3,
    };
    const sort_index = sort_map[sort_criterion];
    return sort_index;
  };

  // --------------------------------------------

  // -Radio button state (sort-type: {asc, desc):
  const sort_types = ['desc', 'asc'];
  const [sort_type, setSortType] = useState(sort_types[0]);

  // --------------------------------------------

  // -Date range:
  const [date_range, setDateRange] = useState<DateRangeTuple>([NaN, NaN]);
  useEffect(() => {
    setDateRange(initializeDateRange());
  }, []);

  // --------------------------------------------

  useEffect(() => {
    // -Don't do this on page change
    setPage(1); // -Change pagination to first page
  }, [rows_per_page, props.filter_criterion, sort_criterion, sort_type, date_range]);

  // --------------------------------------------

  useEffect(() => {
    console.log('unique check ids: ', unique_check_ids);
    setUniqueCheckIds(new Set()); // this will set unique_check_ids.size === 0, which should make all checks change to un-checked since all rows have a local check that props.unique_check_ids.size !== 0

    console.log(
      `page: ${page}\nrows_per_page: ${rows_per_page}\nfilter_criterion: ${props.filter_criterion}\nsort_critera: ${sort_criterion}\nsort_type: ${sort_type}, date_range: ${date_range}`
    );

    setActiveRow(-1); // -All dropdowns closed
    // getPage(); // -Drop an HTTP request up on this bitch
  }, [page, rows_per_page, props.filter_criterion, sort_criterion, sort_type, date_range]);

  // --------------------------------------------

  const [y0, m0, d0] = index2Date(date_range[0]);
  const [y1, m1, d1] = index2Date(date_range[1]);

  // --------------------------------------------

  const [unique_check_ids, setUniqueCheckIds] = useState(new Set());
  const [all_unchecked, setAllUnchecked] = useState(true);
  const [all_checked, setAllChecked] = useState(false);

  // --------------------------------------------

  const handleMove = (new_status: number) => async () => {
    console.log('Updating messages!');

    try {
      loadingCtx.startLoading(1);
      notificationCtx.begin({ message: 'updating messages...' });

      await sendRequest(
        `/api/messages/update-status/${new_status}`,
        'POST',
        JSON.stringify({
          // NOT ACTUALLY SURE WHAT HAPPENS HERE IF YOU SEND THE SET!!!
          message_ids: Array.from(unique_check_ids), // convert to array
        }),
        {
          'Content-Type': 'application/json',
          Authorization: authCtx.token,
        }
      );
      // console.log('messages_rows: ', rows);
      // setRowCount(Number(num_rows)); // apparently, row_count actually comes in as a string!
      // setMessages(rows);

      // TODO: Update UI with the new moved rows updated status

      // NOTE: the below reset of the set is done in the useEffect for the page udpate!
      // -Just need to trigger it somehow:
      //    --method 1: in endpoint return the updated table via hitting the model
      //      ---The issue here is I am not sending that data to the backend
      //      ---I need to modify the body to send the proper data.
      //    --method 2: make a second HTTP request to grab the page data again
      //      ---Do this first!
      // getPage();

      // authCtx.login(data.token);
      notificationCtx.endSuccess({ message: 'update successful!' });
      loadingCtx.endLoading();
    } catch (err: any) {
      notificationCtx.endError({ message: err.message });
      // loadingCtx.endLoading();
      console.log('catch, error: ', err.message);
    }
  };

  // --------------------------------------------

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0}>
          <Grid item xs={2}>
            <Item>
              <SortMenu {...{ sort_options, sort_criterion, setSortCriterion, sort_types, sort_type, setSortType }} />
            </Item>
          </Grid>

          <Grid item xs={3}>
            <Item>
              <Dropdown title={`${months[m0]} ${d0}, ${y0} - ${months[m1]} ${d1}, ${y1}`}>
                <CalendarDateRange setDateRange={setDateRange} />
              </Dropdown>
            </Item>
          </Grid>
        </Grid>
      </Box>

      {/* Messages Table */}
      <TableContainer component={Paper} sx={{ minWidth: '1000px' }}>
        <Table aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={4} sx={{ background: 'lightgreen' }}>
                <Box
                  sx={{
                    // background: 'red',
                    width: '350px',
                    paddingLeft: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Checkbox
                    checked={all_checked && !all_unchecked}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setAllChecked(event.target.checked);
                      setAllUnchecked(!event.target.checked);
                    }}
                  />

                  {props.filter_criterion === 'unread' && (
                    <Popover label="Delete">
                      <DeleteIcon
                        className={all_unchecked ? css.disabled : css.pointer}
                        onClick={!all_unchecked ? handleMove(2) : () => {}}
                      />
                    </Popover>
                  )}

                  {props.filter_criterion === 'trash' && (
                    <Popover label="Mark as unread">
                      <DraftsIcon
                        className={all_unchecked ? css.disabled : css.pointer}
                        onClick={!all_unchecked ? handleMove(0) : () => {}}
                        sx={{ cursor: 'pointer' }}
                      />
                    </Popover>
                  )}

                  <Popover label="Move to">
                    <DriveFileMoveIcon className={all_unchecked ? css.disabled : css.pointer} />
                  </Popover>

                  <Dropdown2>
                    <Popover label="Add label">
                      <LabelIcon className={all_unchecked ? css.disabled : css.pointer} />
                    </Popover>
                  </Dropdown2>

                  <MoreVertIcon />
                </Box>
              </TableCell>

              {/* <TableCell align="right">status</TableCell> */}
              {/* <TableCell align="right">email (username)</TableCell> */}
              {/* <TableCell align="right"></TableCell> */}
              <TableCell colSpan={4} align="right" sx={{ background: 'lightblue' }}>
                <Pagination
                  page={page}
                  setPage={setPage}
                  rows_per_page={rows_per_page}
                  setRowsPerPage={setRowsPerPage}
                  row_count={row_count}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.messages.map((message: any, idx: number) => (
              <Row
                key={idx}
                row={message}
                row_idx={idx}
                active_row={active_row}
                setActiveRow={setActiveRow}
                unique_check_ids={unique_check_ids}
                setUniqueCheckIds={setUniqueCheckIds}
                setAllUnchecked={setAllUnchecked}
                all_checked={all_checked}
                setAllChecked={setAllChecked}
                all_unchecked={all_unchecked}
                rows_per_page={rows_per_page}
                // setMessages={props.setMessages}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
    </>
  );

  // --------------------------------------------
}

// ==============================================
