
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SelectedEvent } from '../pages/Calendar';

interface Props {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  data: SelectedEvent | null;
}

const CalendarPopup = ({ anchorEl, handleClose, data }: Props) => {

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box sx={{ minWidth: 275, maxWidth: 345 }}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {data?.title}
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Calendar
          </Typography>
          <Typography variant="body2" gutterBottom>
            Calendar content
          </Typography>
        </Paper>
      </Box>
    </Popover>
  )
}

export default CalendarPopup