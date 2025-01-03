import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/get-bookings?date=${formattedDate}`);
      setBookings(res.data);
    };
    fetchBookings();
  }, [selectedDate]);

  return (
    <div>
      <h2>Booking Calendar</h2>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy-MM-dd"
      />
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            {booking.time} - {booking.name} ({booking.guests} guests)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarView;
