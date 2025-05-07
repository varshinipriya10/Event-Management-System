import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventDetails = ({ userId }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleAddToCart = async (event) => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        userId,
        eventId: event._id,
      });
      alert(`${event.eventName} has been added to your cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.response?.data?.message || 'Failed to add event to cart.');
    }
  };

  const currentDate = new Date('2025-05-04');
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDate);
    return eventDate > currentDate;
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Event Details</h2>
      {upcomingEvents.length > 0 ? (
        upcomingEvents.map((event) => (
          <div key={event._id} className="border p-4 mb-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{event.eventName}</h3>
            <p>{event.eventDescription}</p>
            <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>
            <p><strong>Location:</strong> {event.eventLocation}</p>
            <p><strong>Price:</strong> ${event.price}</p>
            <p><strong>Capacity:</strong> {event.capacity}</p>
            <p><strong>Category:</strong> {event.category}</p>
            {event.organizerId && (
              <p><strong>Organized by:</strong> {event.organizerId.firstName} {event.organizerId.lastName}</p>
            )}
            <button
              onClick={() => handleAddToCart(event)}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add to Cart
            </button>
          </div>
        ))
      ) : (
        <p>No upcoming events available.</p>
      )}
    </div>
  );
};

export default EventDetails;