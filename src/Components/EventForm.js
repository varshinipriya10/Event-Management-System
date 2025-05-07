import React, { useState } from 'react';
import axios from 'axios';
import './EventForm.css';

const EventForm = ({ organizerId, userEmail }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventDescription: '',
    eventLocation: '',
    eventPrice: '',
    eventCapacity: '',
    eventCategory: '',
    organizerId: organizerId || '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  console.log('EventForm props:', { organizerId, userEmail });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.eventName) newErrors.eventName = 'Event Name is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event Date is required';
    if (!formData.eventDescription) newErrors.eventDescription = 'Event Description is required';
    if (!formData.eventLocation) newErrors.eventLocation = 'Event Location is required';
    if (!formData.eventPrice) newErrors.eventPrice = 'Event Price is required';
    if (!formData.eventCapacity) newErrors.eventCapacity = 'Event Capacity is required';
    if (!formData.eventCategory) newErrors.eventCategory = 'Event Category is required';
    if (!formData.organizerId) newErrors.organizerId = 'Organizer ID is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted, formData:', formData);

    setMessage('');
    const validationErrors = validateForm();
    console.log('Validation errors:', validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('Validation failed, stopping submission');
      return;
    }

    console.log('Sending request to /api/events');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/events', {
        eventName: formData.eventName,
        eventDate: formData.eventDate,
        eventDescription: formData.eventDescription,
        eventLocation: formData.eventLocation,
        price: Number(formData.eventPrice),
        capacity: Number(formData.eventCapacity),
        category: formData.eventCategory,
        organizerId: formData.organizerId,
      });
      console.log('Response:', response.data);
      setMessage('Event created successfully!');
      setFormData({
        eventName: '',
        eventDate: '',
        eventDescription: '',
        eventLocation: '',
        eventPrice: '',
        eventCapacity: '',
        eventCategory: '',
        organizerId: organizerId,
      });
      setErrors({});
    } catch (err) {
      console.error('Error in API call:', err);
      setMessage(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-container">
      <h3>Create Event</h3>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            placeholder="Enter event name"
          />
          {errors.eventName && <span style={{ color: 'red' }}>{errors.eventName}</span>}
        </div>
        <div>
          <label>Event Date</label>
          <input
            type="datetime-local"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />
          {errors.eventDate && <span style={{ color: 'red' }}>{errors.eventDate}</span>}
        </div>
        <div>
          <label>Event Description</label>
          <textarea
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
            placeholder="Enter event description"
          />
          {errors.eventDescription && <span style={{ color: 'red' }}>{errors.eventDescription}</span>}
        </div>
        <div>
          <label>Event Location</label>
          <input
            type="text"
            name="eventLocation"
            value={formData.eventLocation}
            onChange={handleChange}
            placeholder="Enter event location"
          />
          {errors.eventLocation && <span style={{ color: 'red' }}>{errors.eventLocation}</span>}
        </div>
        <div>
          <label>Event Price</label>
          <input
            type="number"
            name="eventPrice"
            value={formData.eventPrice}
            onChange={handleChange}
            placeholder="Enter event price"
          />
          {errors.eventPrice && <span style={{ color: 'red' }}>{errors.eventPrice}</span>}
        </div>
        <div>
          <label>Event Capacity</label>
          <input
            type="number"
            name="eventCapacity"
            value={formData.eventCapacity}
            onChange={handleChange}
            placeholder="Enter event capacity"
          />
          {errors.eventCapacity && <span style={{ color: 'red' }}>{errors.eventCapacity}</span>}
        </div>
        <div>
          <label>Event Category</label>
          <select
            name="eventCategory"
            value={formData.eventCategory}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
          </select>
          {errors.eventCategory && <span style={{ color: 'red' }}>{errors.eventCategory}</span>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default EventForm;