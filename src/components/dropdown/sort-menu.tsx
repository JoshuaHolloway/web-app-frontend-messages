import { useState, MouseEvent } from 'react';
import Check from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, alpha } from '@mui/material/styles';

// ==============================================

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

// ==============================================

export default function SortMenu(props: {
  sort_options: string[];
  sort_criterion: string;
  setSortCriterion: any;
  sort_types: string[];
  sort_type: string;
  setSortType: any;
}) {
  // --------------------------------------------

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleSortOptionClick = (idx: number) => (event: MouseEvent<HTMLElement>) => {
    props.setSortCriterion(props.sort_options[idx]);
    handleClose();
  };

  const handleSortTypeClick = (idx: number) => (event: MouseEvent<HTMLElement>) => {
    props.setSortType(props.sort_types[idx]);
    handleClose();
  };

  // --------------------------------------------

  const sort_options = [
    {
      title: 'date & time',
    },
    {
      title: 'name (first)',
    },
    {
      title: 'name (last)',
    },
    {
      title: 'username',
    },
  ];

  // --------------------------------------------

  const sort_types = [
    {
      title: 'descending',
    },
    {
      title: 'ascending',
    },
  ];

  // --------------------------------------------

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Sort By
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {sort_options.map((sort_option, idx) => {
          return (
            <MenuItem key={`${sort_option.title}-${idx}`} onClick={handleSortOptionClick(idx)}>
              {props.sort_criterion === props.sort_options[idx] ? (
                <>
                  <ListItemIcon>
                    <Check />
                  </ListItemIcon>
                  {sort_option.title}
                </>
              ) : (
                <ListItemText inset>{sort_option.title}</ListItemText>
              )}
            </MenuItem>
          );
        })}

        <Divider />

        {sort_types.map((sort_type, idx) => {
          return (
            <MenuItem key={`${sort_type.title}-${idx}`} onClick={handleSortTypeClick(idx)}>
              {props.sort_type === props.sort_types[idx] ? (
                <>
                  <ListItemIcon>
                    <Check />
                  </ListItemIcon>
                  {sort_type.title}
                </>
              ) : (
                <ListItemText inset>{sort_type.title}</ListItemText>
              )}
            </MenuItem>
          );
        })}
      </StyledMenu>
    </div>
  );
}
