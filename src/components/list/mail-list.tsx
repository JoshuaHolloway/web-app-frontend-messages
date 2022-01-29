import { useState } from 'react';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import InboxIcon from '@mui/icons-material/Inbox';
// import LabelIcon from '@mui/icons-material/Label';
// import SendIcon from '@mui/icons-material/Send';
// import StarBorder from '@mui/icons-material/StarBorder';
import Box from '@mui/material/Box';
// import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
import MailListDropdown from './mail-list-dropdown';

// ==============================================

export default function MailList(p: {
  filter_options: string[];
  filter_criterion: string;
  setFilterCriterion: any;
  setMessages: any;
}) {
  // --------------------------------------------

  // Active dropdown:
  const [active_row, setActiveRow] = useState<number>(-1); // -1 => ALL rows have open=false

  // --------------------------------------------

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="main mailbox folders">
        <MailListDropdown
          box_label="Inbox"
          active_row={active_row}
          setActiveRow={setActiveRow}
          row_idx={0}
          setMessages={p.setMessages}
        />
        <Divider />
        <MailListDropdown
          box_label="Outbox"
          active_row={active_row}
          setActiveRow={setActiveRow}
          row_idx={1}
          setMessages={p.setMessages}
        />
      </List>
    </Box>
  );
}
