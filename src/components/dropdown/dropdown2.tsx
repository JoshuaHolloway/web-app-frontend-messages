import * as React from 'react';
// import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';

// ==============================================

export default function Dropdown2(props: { children: JSX.Element }) {
  // --------------------------------------------

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // --------------------------------------------

  return (
    <div>
      <div onClick={handleClick} role="button">
        {props.children}
      </div>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
        {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
        {/* <MenuItem onClick={handleClose}>Logout</MenuItem> */}
        Dropdown stuff here...
      </Menu>
    </div>
  );

  // --------------------------------------------
}
