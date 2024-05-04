/* eslint-disable */
import * as React from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import NewEvent from '../components/NewEvent';
import EventTableRow from '../components/EventTableRow';
import ConfirmDialog from '../components/ConfirmDialog';


interface HeadCell {
  id: string;
  label: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  participants: string[];
}



const headCells: readonly HeadCell[] = [
  {
    id: 'title',
    label: 'Title',
  },
  {
    id: 'startDateTime',
    label: 'Start Date',
  },
  {
    id: 'endDateTime',
    label: 'End Date',
  },
  {
    id: 'participants',
    label: 'Participants',
  },
  {
    id: 'actions',
    label: 'Actions',
  },
];


export default function EventPage() {

  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [events, setEvents] = React.useState<Event[] | []>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setOpen(true);
  }

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/events`);
      const data = await response.json();
      console.log(data);
  
      setEvents(data);
    } catch (e) {
      console.error(e);
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_API_URL}/events/${id}`, {
        method: 'DELETE',
      });
      events.splice(events.findIndex((event) => event.id === id), 1);
      setEvents([...events]);
    } catch (e) {
      console.error(e);
    }
  }

  React.useEffect(() => {
    fetchEvents();
  }, []);


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Events</Typography>

        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
          New Event
        </Button>
      </Stack>

      <Card>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id}>
                    <TableSortLabel hideSortIcon>
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((row) => (
                <EventTableRow
                  key={row?.id}
                  title={row?.title}
                  startDateTime={new Date(row?.startDateTime).toLocaleString()}
                  endDateTime={new Date(row?.endDateTime).toLocaleString()}
                  participants={row?.participants}
                  onEditClick={() => handleEditClick(row)}
                  onDeleteClick={() => handleDeleteClick(row)}
                />
              ))}

              {/* <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, users.length)}
              />

              {notFound && <TableNoData query={filterName} />} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <LocalizationProvider dateAdapter={AdapterMoment}>
        <NewEvent 
          open={open} 
          handleClose={handleClose} 
          scroll='paper' 
          selectedEvent={selectedEvent} 
          setEvents={setEvents}
          setSelectedEvent={setSelectedEvent}
        />
      </LocalizationProvider>

      <ConfirmDialog 
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        handleClickAgree={() => {
          console.log('delete');
          setOpenDialog(false);
          deleteEvent(selectedEvent?.id || '');
        }} 
      />
    </Container>
  );
}