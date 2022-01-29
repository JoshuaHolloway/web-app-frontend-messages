import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

// ==============================================

export default function MouseOverPopover(props: { children: JSX.Element; label: string }) {
  // --------------------------------------------

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // --------------------------------------------

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // --------------------------------------------

  const open = Boolean(anchorEl);

  // --------------------------------------------

  return (
    <div
      style={{
        // background: 'yellow',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '5px',
        padding: 0,
      }}
    >
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        {props.children}
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{props.label}</Typography>
      </Popover>
    </div>
  );
}
