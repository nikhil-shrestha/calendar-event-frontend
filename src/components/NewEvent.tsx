/* eslint-disable */
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MuiChipsInput } from 'mui-chips-input'

import moment, { Moment } from 'moment';
import { Event } from '../pages/Event';


export interface FormValues {
  title: string;
  description: string;
  startDateTime: string | Date | Moment;
  endDateTime: string | Date | Moment;
  participants: string[];
}

interface Props {
  open: boolean;
  handleClose: () => void;
  scroll: 'paper' | 'body';
  selectedEvent: Event | null;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>;
}

export default function NewEvent({ open, handleClose, scroll, selectedEvent, setEvents, setSelectedEvent }: Props) {
  const { register, handleSubmit, reset, control } = useForm<FormValues>();

  React.useEffect(() => {
    reset({
      title: selectedEvent?.title ||  '',
      description: selectedEvent?.description ||  '',
      startDateTime: moment(selectedEvent?.startDateTime) || moment(),
      endDateTime: moment(selectedEvent?.endDateTime) || moment(),
      participants: selectedEvent?.participants || []
    })
  }, [selectedEvent])

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    const cloneData = {...data}
    data = {
      ...data,
      startDateTime: moment.utc(cloneData.startDateTime),
      endDateTime: moment.utc(cloneData.endDateTime),
    }
    try {
      if (selectedEvent) {
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/events/${selectedEvent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          setSelectedEvent(null);
          reset();
        }
        handleClose();
        return;
      }
      // await fetch()
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log(response);
        const eventData = await response.json();
        console.log(eventData);
        setEvents((prev) => [...prev, eventData])
        reset();
      } 
      handleClose();

    } catch (e) {
      // handle your error
      console.error(e);
      handleClose();
    }
  };


  // const handleChange = (newChips) => {
  //   setChips(newChips)
  // }


  return (
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Add New Event</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  label="Title"
                  type="text"
                  fullWidth
                  {...register("title")}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="startDateTime"
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      onChange={onChange} // send value to hook form
                      value={value}
                      label="Start Date time"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  control={control}
                  name="endDateTime"
                  render={({ field: { onChange, value } }) => (
                    <DateTimePicker
                      onChange={onChange} // send value to hook form
                      value={value}
                      label="End Date time"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-textarea"
                  label="Description"
                  placeholder="Placeholder"
                  fullWidth
                  multiline
                  {...register("description")}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="participants"
                  render={({ field: { onChange, value } }) => (
                    <MuiChipsInput
                      onChange={onChange} // send value to hook form
                      value={value}
                      label="Participants"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" type="submit">
              {selectedEvent ? 'Update' : 'Create'}
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
  );
}