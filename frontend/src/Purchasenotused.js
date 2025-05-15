import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Purchase() {
  const { id } = useParams();

  useEffect(() => {
    console.log('🚀 Initiating payment for article:', id);

    localStorage.setItem('pending_article_id', id);

    const initiatePayment = async () => {
      const response = await fetch('http://localhost:5002/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: `txn_${Date.now()}`,
          userEmail: localStorage.getItem('openscroll_user_email'),
          amount: 50, // or article.price
        }),
      });

      const data = await response.json();
      console.log('💡 PhonePe response:', data);

      const redirectUrl = data?.data?.instrumentResponse?.redirectInfo?.url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        alert('⚠️ Payment initiation failed.');
      }
    };

    initiatePayment();
  }, [id]);

  return <div>Redirecting to PhonePe...</div>;
}

export default Purchase;
