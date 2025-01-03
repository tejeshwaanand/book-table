import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Layout from '@/app/layout';
import '../styles/admin.css';
import { useRouter } from 'next/router';

const Admin = () => {
  const [bookings, setBookings] = useState([]); // Ensure bookings is an array initially
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Fetch bookings based on the selected date
  const fetchBookingsByDate = async (date) => {
    try {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
      const response = await axios.get(`http://localhost:5000/api/bookings/get-bookings?date=${formattedDate}`);
      console.log(response.data);
      
      // Check if response data is an array
      if (Array.isArray(response.data)) {
        setBookings(response.data); // Set the bookings state if the data is an array
      } else {
        setBookings([]); // Clear bookings if the response is invalid
      }
      setErrorMessage('');
      setLoading(false);
    } catch (error) {
      setErrorMessage('Error fetching bookings');
      setLoading(false);
    }
  };

  // Handle deleting a booking
  const handleDeleteBooking = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this booking?");
    if (!isConfirmed) {
      return; // If the user cancels, exit the function without deleting
    }
    try {
      await axios.delete(`http://localhost:5000/api/bookings/delete-booking/${id}`);
      setBookings(bookings.filter((booking) => booking._id !== id)); // Remove the deleted booking from the list
    } catch (error) {
      setErrorMessage('Error deleting booking');
    }
  };

  // Trigger the search after selecting a date
  const handleSearch = () => {
    fetchBookingsByDate(selectedDate);
  };

  // Fetch bookings for today's date when the component loads
  useEffect(() => {
    fetchBookingsByDate(selectedDate);
  }, []); // Run only once on component mount


  const handleViewConfirmation = (booking) => {
    router.push({
      pathname: '/summary',
      query: {
        name: booking.name,
        contact: booking.contact,
        date: booking.date,
        time: booking.time,
        guests: booking.guests,
      },
    });
  };

  return (
    <Layout>
      <div className="admin-page">
        <h1>Admin - Manage Bookings</h1>

        {/* Date Picker to select date */}
        <div className="date-picker-container">
          <label>Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)} // Only update the selected date
          />

          {/* Search Button */}
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        {loading ? (
          <p>Loading bookings...</p>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Guests</th>
                <th>Slot</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Ensure bookings is an array and has content */}
              {Array.isArray(bookings) && bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td onClick={() => handleViewConfirmation(booking)} style={{'color':'blue', 'cursor':'pointer'}}>{booking.date}</td>
                    <td onClick={() => handleViewConfirmation(booking)} style={{'color':'blue', 'cursor':'pointer'}}>{booking.name}</td>
                    <td onClick={() => handleViewConfirmation(booking)} style={{'color':'blue', 'cursor':'pointer'}}>{booking.contact}</td>
                    <td onClick={() => handleViewConfirmation(booking)} style={{'color':'blue', 'cursor':'pointer'}}>{booking.guests}</td>
                    <td onClick={() => handleViewConfirmation(booking)} style={{'color':'blue', 'cursor':'pointer'}}>{booking.time}</td>
                    <td>
                      <button onClick={() => handleDeleteBooking(booking._id)} className="delete-button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No bookings available for this date</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Display error message */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    </Layout>
  );
};

export default Admin;
