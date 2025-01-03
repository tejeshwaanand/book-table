import React from 'react';
import { useRouter } from 'next/router';

const ConfirmationPage = () => {
  const router = useRouter();
  const { date, time, name, guests, contact } = router.query;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <h2>Booking Confirmation</h2>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Guests:</strong> {guests}</p>
        <p><strong>Contact:</strong> {contact}</p>
        <button onClick={handlePrint} className="print-button">
          Print Confirmation
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
