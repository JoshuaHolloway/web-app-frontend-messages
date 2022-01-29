import { useState, useEffect, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import InboxIcon from '@mui/icons-material/Inbox';
import LabelIcon from '@mui/icons-material/Label';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import SendIcon from '@mui/icons-material/Send';
import StarBorder from '@mui/icons-material/StarBorder';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AuthContext from '@src/code/context/auth-context';
import NotificationContext from '@src/code/context/notification-context';
import { useHttpClient } from '@src/code/hooks/http-hook';
import { MessageHttp } from '@src/code/types/MessageHttp';
import MailListDropdownCategory from '@src/components/list/mail-list-dropdown-category';

// ==============================================

const boxs = ['inbox', 'outbox'];

const sub_boxs = ['unread', 'read', 'starred', 'trash', 'category'];

// ==============================================

export default function MailListDropdown(p: {
  box_label: string;
  active_row: number;
  setActiveRow: any;
  row_idx: number;
  setMessages: any;
}) {
  // --------------------------------------------

  const { sendRequest } = useHttpClient();
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  // const loadingCtx = useContext(LoadingContext);

  // --------------------------------------------

  // 0=Unread,  1=read,  2=starred,  3=trash,  4=category
  const [selected_list_item_idx, setSelectedListItemIdx] = useState(-1);
  const handleListItemClick = (idx: number) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setSelectedListItemIdx(idx);
    setSelectedCategoryIdx(null);

    do_fetch({ box: boxs[p.row_idx], sub_box: sub_boxs[idx], category: null });
  };

  const [selected_category_idx, setSelectedCategoryIdx] = useState<number | null>(null);

  // --------------------------------------------

  const [open, setOpen] = useState(true);
  const handleDropdownClick = () => {
    if (open) {
      // -The arrow was clicked when open=true => ALL of the rows will be collapsed afterwards.
      p.setActiveRow(-1); // this triggers useEffect(, [p.active_num]) on ALL rows (including this one) and sets open = true
    } else {
      // -The arrow was clicked when open=false => this row is expanded and all others are closed involuntarily
      setOpen((prev) => !prev);
      p.setActiveRow(p.row_idx);
      setSelectedCategoryIdx(null);

      do_fetch({ box: boxs[p.row_idx], sub_box: 'unread & read', category: null });
    }
  };

  // --------------------------------------------

  useEffect(() => {
    if (p.row_idx !== p.active_row) {
      setOpen(false); // closes all dropdowns (syncronized to all be closed)
      setSelectedListItemIdx(-1); // -takes highlighting off of the currently active nav-link (i.e. selection in this current dropdown)
    }
  }, [p.active_row]);

  // --------------------------------------------

  // order_by       /dashboard/mail (index.tsx) => <MailListTable /> => <SortMenu />  =>  [] = useState
  // sort_type      /dashboard/mail (index.tsx) => <MailListTable /> => <SortMenu />  =>  [] = userState
  // rows_per_page
  // page_num,
  // date_lo,
  // date_hi,

  const do_fetch = async ({ box, sub_box, category }: { box: string; sub_box: string; category: number | null }) => {
    console.log('do_fetch()', '\nbox: ', box, '\nsub_box: ', sub_box);

    try {
      // loadingCtx.startLoading();
      // notificationCtx.begin({ message: 'logging in...' });

      const res: MessageHttp[] = await sendRequest(
        `/api/messages`,
        'POST',
        JSON.stringify({ box, sub_box, category }),
        {
          'Content-Type': 'application/json',
          Authorization: authCtx.token,
        }
      );

      // console.log('num_rows: ', num_rows, '\nmessages_rows: ', rows);
      // setRowCount(Number(num_rows)); // apparently, row_count actually comes in as a string!
      p.setMessages(res);

      // authCtx.login(data.token);
      // notificationCtx.endSuccess({ message: 'successfully logged in!' });
      // loadingCtx.endLoading();
    } catch (err: any) {
      notificationCtx.endError({ message: err.message });
      // loadingCtx.endLoading();
      console.log('catch, error: ', err.message);
    }
  };

  // --------------------------------------------

  // -Load inbox (read and unread) on page load:
  useEffect(() => {
    // if (!isNaN(date_range[0]) && !isNaN(date_range[1])) {
    p.setActiveRow(0); // inbox row
    setOpen(true);
    do_fetch({ box: 'inbox', sub_box: 'unread & read' });
    // }
  }, []);

  // --------------------------------------------

  // -Category selected:
  useEffect(() => {
    if (selected_category_idx !== null) {
      // console.clear();
      console.log('category idx: ', selected_category_idx);

      do_fetch({ box: boxs[p.row_idx], sub_box: 'category', category: selected_category_idx });
    }
  }, [selected_category_idx]);

  // --------------------------------------------

  const list_items = [
    {
      elem: <MarkunreadMailboxIcon />,
      title: 'Unread',
    },
    {
      elem: <SendIcon />,
      title: 'Read',
    },
    {
      elem: <StarBorder />,
      title: 'Starred',
    },
    {
      elem: <DeleteIcon />,
      title: 'Trash',
    },
  ];

  // --------------------------------------------

  return (
    <>
      <ListItemButton
        selected={p.active_row === p.row_idx && selected_list_item_idx === -1}
        onClick={handleDropdownClick}
        sx={{ color: p.active_row === p.row_idx || p.active_row === -1 ? '' : 'lightgray' }}
      >
        <ListItemIcon sx={{ color: 'inherit' }}>
          {p.box_label === 'Inbox' ? <ForwardToInboxIcon /> : <InboxIcon />}
        </ListItemIcon>
        <ListItemText primary={p.box_label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {list_items.map((list_item, idx) => (
            <ListItemButton
              key={`${list_item.title}-${idx}`}
              selected={selected_list_item_idx === idx}
              onClick={handleListItemClick(idx)}
              sx={{ color: selected_list_item_idx === idx || selected_list_item_idx === -1 ? '' : 'lightgray' }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{list_item.elem}</ListItemIcon>
              <ListItemText primary={list_item.title} />
            </ListItemButton>
          ))}

          <MailListDropdownCategory
            box_label="Categories"
            setSelectedListItemIdx={setSelectedListItemIdx}
            selected_list_item_idx={selected_list_item_idx}
            setSelectedCategoryIdx={setSelectedCategoryIdx}
            selected_category_idx={selected_category_idx}
          />
        </List>
      </Collapse>
    </>
  );
}
