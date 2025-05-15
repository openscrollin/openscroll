import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function PurchasePage() {
  const { id: articleId } = useParams();
  const [price, setPrice] = useState(null);

  useEffect(() => {
    localStorage.setItem('pending_article_id', articleId);

    const fetchPriceAndPay = async () => {
      try {
        const articleRes = await fetch(`http://localhost:5002/api/articles/public/${articleId}`);
        const article = await articleRes.json();
        setPrice(article.price);

        const userEmail = localStorage.getItem('openscroll_user_email');
        const transactionId = `txn_${userEmail}_${articleId}`;

        const paymentRes = await fetch('http://localhost:5002/api/payment/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId,
            userEmail,
            amount: article.price,
          }),
        });

        const data = await paymentRes.json();
        const redirectUrl = data?.data?.instrumentResponse?.redirectInfo?.url;

        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          alert('⚠️ Payment initiation failed. Please try again.');
        }
      } catch (err) {
        console.error('❌ Error during payment:', err);
        alert('Something went wrong while starting payment.');
      }
    };

    fetchPriceAndPay();
  }, [articleId]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Nunito Sans' }}>
      <h2>Redirecting to PhonePe...</h2>
      <p>Processing payment of ₹{price || '...'}</p>
    </div>
  );
}

export default PurchasePage;
