import React, { useState } from 'react';
import EventForm from './EventForm';

const EventManagement = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div>
      <h1>Event Management</h1>
      <button onClick={toggleFormVisibility}>
        {isFormVisible ? 'Hide Event Form' : 'Create Event'}
      </button>

      {isFormVisible && <EventForm />}
    </div>
  );
};

export default EventManagement;
