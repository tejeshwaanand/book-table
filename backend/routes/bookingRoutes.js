const express = require('express');
const { createBooking, getBookings, deleteBooking, getBooking, getAvailableSlots, getBookingbynameandcontact, cancelBooking } = require('../controllers/bookingController');

const router = express.Router();

router.post('/create-booking', createBooking);
router.get('/get-bookings', getBookings);
router.get('/get-booking/:id', getBooking);
router.delete('/delete-booking/:id', deleteBooking);
router.get('/get-available-slots', getAvailableSlots);
router.get('/get-booking-name', getBookingbynameandcontact);
router.delete('/cancel-booking', cancelBooking);

module.exports = router;
