/* eslint-disable */
import * as React from 'react';
import { useEffect } from 'react';

import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';

import moment from 'moment';

import SelectDropdown from '../components/SelectDropdown';
import CalendarPopup from '../components/CalendarPopup';

// import events from '../events';
import timezoneData from '../timezones';
import { usePrevious } from '../hooks/usePrevious';
import { Event } from './Event';

export interface Holiday {
  uuid: string;
  name: string;
  date: Date;
  observed: Date;
  country: string;
  public: boolean;
}

export interface Country {
  name: string;
  code: string;
  flag: string;
}

export interface SelectedEvent {
  id: string;
  title: string;
  description: string;
  start: Date | null;
  end: Date | null;
  isEditable: boolean;
}

export default function CalendarPage() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [timezone, setTimezone] = React.useState('local');
  const [countries, setCountries] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState('NP');
  // const [year, setYear] = React.useState('2023');
  const [selectedEvent, setSelectedEvent] = React.useState<SelectedEvent | null>(null);

  const [events, setEvents] = React.useState([]);
  const [holidays, setHolidays] = React.useState([]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_API_URL}/events`);
      const data = await response.json();
      console.log(data);

      setEvents(() => data.map((event: Event) => ({
        id: event.id,
        title: event.title,
        start: moment.utc(event.startDateTime).local().format('YYYY-MM-DDTHH:mm:ss'),
        end: moment.utc(event.endDateTime).local().format('YYYY-MM-DDTHH:mm:ss'),
        allDay: false,
        isEditable: true,
      })));
    } catch (e) {
      console.error(e);
    }
  }

  const fetchHolidays = async (country: string) => {
    try {
      const params: Record<string, string | number> = {
        "country": country,
        "year": "2023"
      };
      
      const query = Object.keys(params)
                   .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                   .join('&');
      const response = await fetch(`${import.meta.env.BASE_API_URL}/holidays?${query}`);
      const data = await response.json();
      console.log(data);

      const result = data.map((holiday: Holiday) => ({
        id: holiday.uuid,
        title: holiday.name,
        start: holiday.date,
        end: holiday.date,
        allDay: true,
        isEditable: false,
      }))

      setHolidays(result);
      return result;
    } catch (e) {
      console.error(e);
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_API_URL}/holidays/countries`);
      const data = await response.json();
      console.log(data);

      setCountries(() => data.map((country: Country) => ({
        label: country.name,
        value: country.code,
      })));

    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchEvents();
    // fetchHolidays();
    fetchCountries();
  }, []);

  const prevSelectedCountry = usePrevious(selectedCountry);

  useEffect(() => {
    if (prevSelectedCountry != selectedCountry) {
      fetchHolidays(selectedCountry);
    }
  }, [prevSelectedCountry, selectedCountry]);


  const handlePopoverOpen = (event: HTMLElement) => {
    setAnchorEl(event);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeTimezone = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimezone(event.target.value);
  }

  const handleChangeCountry = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCountry(event.target.value);
  }

  // async function getCalendarData(fetchInfo, successCallback, failureCallback) {
  //   try {
  //     let year = new Date().getFullYear();
    
  //     if (fetchInfo) {
  //       year = new Date(fetchInfo.start).getFullYear();
  //     }

  //     setYear(year.toString());
    
  //     const response = await fetchHolidays(selectedCountry, year.toString());
    
  //     successCallback(response.concat(events));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  
	return (
    <Container>
      <Stack mb={5} direction="row" alignItems="center" >
        {/* Timezones */}
        <SelectDropdown
          value={timezone}
          options={timezoneData}
          onSort={handleChangeTimezone}
        />

        {/* Countries */}
        <SelectDropdown
          value={selectedCountry}
          options={countries}
          onSort={handleChangeCountry}
        />
      </Stack>
      <FullCalendar
        plugins={[
          dayGridPlugin,
          interactionPlugin,
          timeGridPlugin,
          momentTimezonePlugin
        ]}
        timeZone={timezone}
        headerToolbar={{
          left: '',
          center: 'title',
          right: 'today prev,next'
        }}
        initialView='dayGridMonth'
        nowIndicator={true}
        selectable={true}
        selectMirror={true}
        initialEvents={[
          { title: 'nice event', start: new Date(), resourceId: 'a' }
        ]}
        events={[...events, ...holidays]}
        eventClick={(info) => {
          console.log(info.event);
          handlePopoverOpen(info.el);
          setSelectedEvent({
            id: info.event.id,
            title: info.event.title,
            description: info.event.extendedProps?.description,
            start: info.event.start,
            end: info.event.end,
            isEditable: info.event.extendedProps?.isEditable
          });
        }}
      />
      {anchorEl && (
        <CalendarPopup anchorEl={anchorEl} handleClose={handleClose} data={selectedEvent} />
      )}

    </Container>
	);
}