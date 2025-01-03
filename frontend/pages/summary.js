import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/app/layout';
import "../styles/summary.css"
const ConfirmationPage = () => {
  const router = useRouter();
  const { name, contact, date, time, guests } = router.query;

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Booking Summary</h1>
        <div className='info'>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Contact:</strong> {contact}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Time:</strong> {time}</p>
          <p><strong>Guests:</strong> {guests}</p>
          <button 
            onClick={handlePrint}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Print Confirmation
          </button>

        </div>
      </div>
    </Layout>
  );
};

export default ConfirmationPage;
