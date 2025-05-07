import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ticketing = ({ userId }) => {
  const [cart, setCart] = useState({ events: [] });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCart({ events: [] });
      }
    };

    fetchCart();
  }, [userId]);

  const payNow = () => {
    alert("Payment Succeeded")
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Ticketing</h2>
      {cart.events.length > 0 ? (
        cart.events.map((event) => (
          <div key={event._id} className="border p-4 mb-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{event.eventName}</h3>
            <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>
            <p><strong>Location:</strong> {event.eventLocation}</p>
            <p><strong>Price:</strong> ${event.price}</p>
            <button onClick={payNow}>Pay Now</button>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Ticketing;