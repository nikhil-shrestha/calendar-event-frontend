import * as React from 'react';

import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

import MoreVertIcon from '@mui/icons-material/MoreVert';


interface EventTableRowProps {
  title: string;
  startDateTime: string;
  endDateTime: string;
  participants: string[];
  onEditClick: () => void;
  onDeleteClick: () => void;
}


export default function EventTableRow({
  title,
  startDateTime,
  endDateTime,
  participants,
  onEditClick,
  onDeleteClick,
}: EventTableRowProps) {
  const [open, setOpen] = React.useState<HTMLButtonElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell component="th" scope="row" padding="none">
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </TableCell>

        <TableCell>{startDateTime}</TableCell>

        <TableCell>{endDateTime}</TableCell>

        <TableCell>
          <Stack direction="row" spacing={1}>
            {!!participants && participants.map((participant) => <Chip label={participant} size="small" /> )}
          </Stack>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={() => {
          onEditClick();
          handleCloseMenu();
        }}>
          Edit
        </MenuItem>

        <MenuItem onClick={() => {
          onDeleteClick();
          handleCloseMenu();
        }} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}