import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './assets/css/user.css';

const Users = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

  useEffect(() => {
    if (loggedInUserEmail) {
      axios.get(`http://localhost:3001/user-bookings/${loggedInUserEmail}`)
        .then(response => {
          setBookings(response.data);
        })
        .catch(error => {
          console.error('Error fetching bookings:', error);
        });
    }
  }, [loggedInUserEmail]);

  const handleCancel = (bookingId) => {
    axios.delete(`http://localhost:3001/admin/${bookingId}`)
      .then(response => {
        setBookings(bookings.filter(booking => booking._id !== bookingId));
      })
      .catch(error => {
        console.error('Error cancelling booking:', error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUserEmail');
    navigate('/login');
  };

  return (
    <div className="users-container">
      <div className="users-content">
        <h1 className="title">Bookings</h1>
        <div style={{ marginBottom: '20px' }}>
          <Link to="/login" className="button" onClick={handleLogout}>Logout</Link>
          <Link to="/service" className="button">Book Hall</Link>
        </div>
        <table className="booking-table">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Event Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking.name}</td>
                <td>{booking.address}</td>
                <td>{booking.phone}</td>
                <td>{booking.eventName}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>
                  <button className="cancel-button" onClick={() => handleCancel(booking._id)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
