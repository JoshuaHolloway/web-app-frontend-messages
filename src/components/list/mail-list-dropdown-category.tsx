import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InboxIcon from '@mui/icons-material/Inbox';
import LabelIcon from '@mui/icons-material/Label';
import SendIcon from '@mui/icons-material/Send';
import StarBorder from '@mui/icons-material/StarBorder';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// ==============================================

export default function MailListDropdownCategory(props: {
  box_label: string;
  setSelectedListItemIdx: (x: number) => void;
  selected_list_item_idx: number;
  setSelectedCategoryIdx: (x: number | null) => void;
  selected_category_idx: number | null;
}) {
  // --------------------------------------------

  // const [selectedIndex, setSelectedIndex] = useState(0); // initialized to filter_options[0]
  const handleListItemClick = (idx: number) => (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // setSelectedIndex(idx);
    // props.setFilterCriterion(props.filter_options[idx]);

    console.log('idx: ', idx);
    props.setSelectedListItemIdx(4); // 0=Unread,  1=read,  2=starred,  3=trash,  4=category
    props.setSelectedCategoryIdx(idx);
  };

  // --------------------------------------------

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((prev) => !prev);
    props.setSelectedListItemIdx(-1);
    props.setSelectedCategoryIdx(null);
  };

  // --------------------------------------------

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{ color: props.selected_list_item_idx === -1 || props.selected_list_item_idx === 4 ? '' : 'lightgray' }}
      >
        <ListItemIcon>
          <LabelIcon />
        </ListItemIcon>
        <ListItemText primary={props.box_label} />
        {/* {open ? <ExpandLess /> : <ExpandMore />} */}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            selected={props.selected_category_idx === 0}
            onClick={handleListItemClick(0)}
            sx={{ color: props.selected_list_item_idx === -1 || props.selected_list_item_idx === 4 ? '' : 'lightgray' }}
          >
            <ListItemIcon>
              <InboxIcon sx={{ visibility: 'hidden' }} />
            </ListItemIcon>
            <ListItemText primary="Category 1" />
          </ListItemButton>

          <ListItemButton selected={props.selected_category_idx === 1} onClick={handleListItemClick(1)}>
            <ListItemIcon>
              <SendIcon sx={{ visibility: 'hidden' }} />
            </ListItemIcon>
            <ListItemText primary="Category 2" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
