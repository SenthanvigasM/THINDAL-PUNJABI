import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './assets/css/hall.css';
import book from './assets/img/book.png';

function Service() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Component Mounted');
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (loggedInUserEmail) {
      setEmail(loggedInUserEmail);
    }
  }, []);

  const checkDateAvailability = async (date, time) => {
    try {
      const response = await axios.post('http://localhost:3001/check-date', { date, time });
      return response.data.available;
    } catch (error) {
      console.error('Error checking date availability:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (email !== loggedInUserEmail) {
      setError('The email provided does not match the logged-in user email.');
      return;
    }

    const isDateAvailable = await checkDateAvailability(date, time);
    if (!isDateAvailable) {
      setError('The selected date and time is already booked. Please choose another slot.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/book-service', { name, email, phone, address, eventName, date, time });
      console.log(response.data);
      if (response.status === 201) {
        console.log("Hall booking created:", response.data);
        setSuccess(true);
        setTimeout(() => {
          navigate('/user');
        }, 2000);
      } else {
        setError(response.data.message || 'An unexpected error occurred');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'An unexpected error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="login-content">
      <img src={book} alt="img" className="log_img" />
      <div className="content">
        <div className="text">Hall  Booking</div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">Hall Booked Successfully</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <input type="text" placeholder='Name' id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <br />
          <div className="field">
            <input type="text" placeholder='Email' id="email" value={email} readOnly />
          </div>
          <br />
          <div className="field">
            <input type="tel" id="phone" placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <br />
          <div className="field">
            <input type="text" placeholder='Address' id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <br />
          <div className="field">
            <input type="text" placeholder='Event Name' id="eventName" value={eventName} onChange={(e) => setEventName(e.target.value)} />
          </div>
          <br />
          <div className="field">
            <input type="date" id="date" placeholder='Date' value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <br />
          <div className="field">
            <input type="time" id="time" placeholder='Time' value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <button type="submit">Submit</button>
          <div className="sign-up">
            <Link to="/user">View Your Bookings</Link> 
          </div>
        </form>
      </div>
    </div>
  );
}

export default Service;
