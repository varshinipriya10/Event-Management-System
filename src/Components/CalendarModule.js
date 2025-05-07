import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarModule.css';

const localizer = momentLocalizer(moment);

const CalendarModule = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Manually defined events
  const events = [
    {
      title: 'Team Meeting',
      start: new Date('2025-04-30T10:00:00'),
      end: new Date('2025-04-30T11:00:00'),
      allDay: false,
      eventDescription: 'Weekly team sync',
      eventLocation: 'Office',
      price: 0,
      capacity: 50,
      category: 'Workshop',
      organizerId: user?.role === 'Organiser' ? user.id : 'org123',
    },
    {
      title: 'Music Concert',
      start: new Date('2025-05-01T18:00:00'),
      end: new Date('2025-05-01T21:00:00'),
      allDay: false,
      eventDescription: 'Live music performance',
      eventLocation: 'City Arena',
      price: 20,
      capacity: 500,
      category: 'Music',
      organizerId: 'org456',
    },
    {
      title: 'Workshop: Coding 101',
      start: new Date('2025-05-02T09:00:00'),
      end: new Date('2025-05-02T12:00:00'),
      allDay: false,
      eventDescription: 'Introduction to programming',
      eventLocation: 'Community Center',
      price: 10,
      capacity: 30,
      category: 'Workshop',
      organizerId: user?.role === 'Organiser' ? user.id : 'org789',
    },
  ];

  // Optionally filter events for Organizers
  const filteredEvents =
    user?.role === 'Organiser'
      ? events.filter((event) => event.organizerId === user.id)
      : events;

  return (
    <div className="calendar-container">
      <h2>Event Calendar</h2>
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
      />
    </div>
  );
};

export default CalendarModule;