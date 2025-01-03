const Booking = require('../models/Booking');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { date, time, guests, name, contact } = req.body;

    // Check for duplicate booking
    const existingBooking = await Booking.findOne({ date, time });
    if (existingBooking) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const newBooking = new Booking({ date, time, guests, name, contact });
    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Get bookings for a specific date
exports.getBookings = async (req, res) => {
  try {
    const { date } = req.query;
    const bookings = await Booking.find({ date });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
  }
};

// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};

// Get a booking by ID
exports.getBooking = async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await Booking.findById(id);
      res.status(200).json({ booking: booking });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
  };

// Get available slots for a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;

    // Predefined list of all available time slots
    const allSlots = [
      "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00",
      "18:00", "19:00", "20:00", "21:00",
    ];

    // Fetch the bookings for the provided date
    const bookings = await Booking.find({ date });

    // Extract the booked slots for the given date
    const bookedSlots = bookings.map((booking) => booking.time);

    // Filter out the available slots by removing the booked ones from the list of all slots
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    res.status(200).json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available slots', error: error.message });
  }
};




// Function to get booking based on date, name, and contact
exports.getBookingbynameandcontact = async (req, res) => {
  try {
    const { date, name, contact } = req.query; // Extract parameters from query string

    // Search the database for bookings matching the criteria
    const booking = await Booking.findOne({
      date: date,         // Match the date
      name: name,         // Match the name
      contact: contact    // Match the contact
    });

    // If booking is found, return it, otherwise return an error message
    if (booking) {
      res.status(200).json({ booking });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};


// Function to cancel a booking based on date, name, and contact
exports.cancelBooking = async (req, res) => {
  try {
    const { date, name, contact } = req.query; // Extract parameters from query string

    // Search the database for the booking that matches the date, name, and contact
    const booking = await Booking.findOneAndDelete({
      date: date,         // Match the date
      name: name,         // Match the name
      contact: contact    // Match the contact
    });

    // If the booking is found and deleted, return a success message
    if (booking) {
      res.status(200).json({ message: 'Booking successfully canceled' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error: error.message });
  }
};


  