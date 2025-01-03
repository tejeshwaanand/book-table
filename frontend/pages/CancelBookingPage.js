import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/globals.css'
import Layout from '@/app/layout';
import '../styles/CancelBookingPage.css'

const CancelBookingPage = () => {
  const [formData, setFormData] = useState({
    date: new Date(),
    name: '',
    contact: '',
  });
  const [bookingDetails, setBookingDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle date change using DatePicker
  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  // Fetch booking details based on the user's input
  const fetchBooking = async () => {
    try {
      const formattedDate = formData.date.toISOString().split('T')[0];
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/get-booking-name?date=${formattedDate}&name=${formData.name}&contact=${formData.contact}`
      );
      if (response.data.booking) {
        setBookingDetails(response.data.booking);
        setErrorMessage('');
        setConfirmationMessage('');
      } else {
        setErrorMessage('No booking found for the given details.');
        setBookingDetails(null);
      }
    } catch (error) {
      setErrorMessage('Error retrieving booking details.');
    }
  };

  // Handle cancel booking
  const cancelBooking = async () => {
    try {
      const formattedDate = formData.date.toISOString().split('T')[0];
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/cancel-booking?date=${formattedDate}&name=${formData.name}&contact=${formData.contact}`
      );
      setConfirmationMessage('Your booking has been canceled successfully.');
      setBookingDetails(null); // Clear booking details after cancellation
    } catch (error) {
      setErrorMessage('Error canceling the booking.');
    }
  };

  return (
    <Layout>
      <div className="cancel-booking-page">
        <h1>Cancel Your Booking</h1>

        {/* Container for the search form */}
        <div className="input-container">
          <div className="text-container">
            <label htmlFor="name">Name:</label>
            <input
              className="input-cancel"
              id="name"
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="contact">Contact:</label>
            <input
              className="input-cancel"
              id="contact"
              type="text"
              name="contact"
              placeholder="Enter contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />

            <div className="date-picker-container">
              <label htmlFor="date">Select Date:</label>
              <DatePicker
                className="date"
                id="date"
                selected={formData.date}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                required
              />
            </div>

            <button onClick={fetchBooking} className="search-button">
              Find Booking
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* Display booking details if found */}
        {bookingDetails && (
          <div className="booking-details">
            <h1>Booking Details:</h1>
            <ul>
              <li>
                <strong>Name:</strong> {bookingDetails.name}
              </li>
              <li>
                <strong>Contact:</strong> {bookingDetails.contact}
              </li>
              <li>
                <strong>Guests:</strong> {bookingDetails.guests}
              </li>
              <li>
                <strong>Time Slot:</strong> {bookingDetails.time}
              </li>
              <li>
                <strong>Date:</strong> {bookingDetails.date}
              </li>
            </ul>

            <button onClick={cancelBooking} className="cancel-button">
              Cancel Booking
            </button>
          </div>
        )}

        {/* Confirmation message */}
        {confirmationMessage && (
          <p style={{ color: "green" }}>{confirmationMessage}</p>
        )}
      </div>
    </Layout>
  );
};

export default CancelBookingPage;
