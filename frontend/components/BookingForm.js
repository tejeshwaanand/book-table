import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router'; // For navigation
import "react-datepicker/dist/react-datepicker.css";
import '../styles/BookingForm.css'; // Import the CSS file

// Generate time slots from 10:00 to 21:00
const generateTimeSlots = () => {
  const slots = [];
  let start = new Date();
  start.setHours(10, 0, 0, 0); // Start at 10:00
  const end = new Date();
  end.setHours(21, 0, 0, 0); // End at 21:00

  while (start <= end) {
    slots.push(start.toTimeString().slice(0, 5)); // Format HH:mm
    start.setMinutes(start.getMinutes() + 60); // Increment by 1 hour
  }
  return slots;
};

const SlotsPage = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [allSlots, setAllSlots] = useState(generateTimeSlots());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    guests: '',
    date: selectedDate,
    time: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showSlots, setShowSlots] = useState(false);

  // Fetch available slots for today's date by default
  useEffect(() => {
    setSelectedSlot('');
    fetchAvailableSlots();
  }, [selectedDate]);

  // Fetch available slots from the API
  const fetchAvailableSlots = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/get-available-slots?date=${formattedDate}`
      );
      setAvailableSlots(response.data.availableSlots || []);
      setErrorMessage('');
      setShowSlots(true);
    } catch (error) {
      setErrorMessage('Error fetching available slots');
      setShowSlots(false);
    }
  };

  // Handle user input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle booking submission
  const handleBooking = async () => {

    if (!formData.name || !/^[a-zA-Z\s]+$/.test(formData.name)) {
      alert('Please enter a valid name (only letters and spaces are allowed).');
      return;
    }
  
    // Validate Contact
    if (!formData.contact || !/^\d{10}$/.test(formData.contact)) {
      alert('Please enter a valid 10-digit contact number.');
      return;
    }
  
    // Validate Guests
    if (!formData.guests || formData.guests <= 0) {
      alert('Please enter a valid number of guests (greater than 0).');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0];
    const dataToSubmit = {
      date: formattedDate,  // The selected date
      time: selectedSlot,  // The selected time slot
      guests: formData.guests,  // Number of guests
      name: formData.name,  // Name of the person
      contact: formData.contact,  // Contact number
    };
    

    try {
      // Send booking data to the backend
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/create-booking`, dataToSubmit);

      // Store the booking data in localStorage
      localStorage.setItem('bookingSummary', JSON.stringify(dataToSubmit));

      // Redirect to confirmation page
      router.push({
        pathname: '/summary',
        query: {
          name: formData.name,
          contact: formData.contact,
          date: formattedDate,
          time: selectedSlot,
          guests: formData.guests,
        },
      });
    } catch (error) {
      alert('Error booking slot: ' + error.message);
    }
  };

  return (
    <div className='mainDiv'>
    <div className='mainImage' />
    <div className="booking-container">
      <h1>Book Your Slot</h1>
      <div className="date-picker-container">
        <label htmlFor="date-picker">Select Date:</label>
        <DatePicker
          id="date-picker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
        <button
          onClick={fetchAvailableSlots}
        >
          Find Slots
        </button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {showSlots && (
        <>
          <h2>Available Slots</h2>
          <div className="slots-grid">
            {allSlots.map((slot, index) => (
              <button
                key={index}
                className={`slot-button ${
                  availableSlots.includes(slot)
                    ? 'available'
                    : 'unavailable'
                } ${selectedSlot === slot ? 'selected' : ''}`}
                onClick={() => {
                  if (availableSlots.includes(slot)) {
                    setSelectedSlot(slot);
                    setFormData({ ...formData, time: slot });
                  }
                }}
              >
                {slot}
              </button>
            ))}
          </div>
          {selectedSlot && (
              <div className="form-section">
                <h3>Enter Your Details</h3>
                <div className='name-input'>

                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id='name'
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='contact-input'>
                  <label htmlFor="contact">Contact:</label>
                  <input id='contact'
                    type="text"
                    name="contact"
                    placeholder="Enter your contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                  />

                </div>
                <div className='guest-input'>
                  <label htmlFor='guest'>Guests:</label>
                  <input id='guest'
                    type="number"
                    name="guests"
                    placeholder="Enter number of guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button onClick={handleBooking}>Confirm Booking</button>
              </div>
          )}
        </>
      )}
    </div>
    </div>
  );
};

export default SlotsPage;
