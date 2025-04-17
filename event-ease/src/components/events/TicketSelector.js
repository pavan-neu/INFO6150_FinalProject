// src/components/events/TicketSelector.js
import React, { useState, useEffect } from 'react';
import './TicketSelector.css';

const TicketSelector = ({ event, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(event.ticketPrice);
  
  useEffect(() => {
    setTotalPrice(event.ticketPrice * quantity);
    onQuantityChange(quantity, totalPrice);
  }, [quantity, event.ticketPrice, onQuantityChange]);

  const incrementQuantity = () => {
    if (quantity < event.ticketsRemaining) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="ticket-selector">
      <h3>Select Tickets</h3>
      <div className="tickets-available">
        <span>{event.ticketsRemaining} tickets available</span>
      </div>
      
      <div className="ticket-price">
        <span>Price per ticket: ${event.ticketPrice.toFixed(2)}</span>
      </div>
      
      <div className="quantity-selector">
        <button 
          className="quantity-btn" 
          onClick={decrementQuantity}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="quantity">{quantity}</span>
        <button 
          className="quantity-btn" 
          onClick={incrementQuantity}
          disabled={quantity >= event.ticketsRemaining}
        >
          +
        </button>
      </div>
      
      <div className="total-price">
        <span>Total: ${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default TicketSelector;