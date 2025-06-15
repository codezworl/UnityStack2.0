import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';



const PaymentForm = ({ clientSecret, amount, sessionId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch session details to get developerId and studentId
  const fetchSessionDetails = async (sessionId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5000/api/sessions/detail/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.session;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please wait.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend (session status)
        await axios.post(
          'http://localhost:5000/api/sessions/confirm-payment',
          {
            sessionId,
            paymentIntentId: paymentIntent.id
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );

        // Save payment info in Payment DB for session
        const session = await fetchSessionDetails(sessionId);
        await axios.post(
          'http://localhost:5000/api/payments/session-payment',
          {
            sessionId,
            paymentIntentId: paymentIntent.id,
            amount,
            studentId: session.studentId?._id || session.studentId,
            developerId: session.developerId?._id || session.developerId
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );

        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      toast.error(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group mb-4">
        <label className="form-label">Card Details</label>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : `Pay PKR ${amount}`}
      </button>
    </form>
  );
};

const SessionPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId, clientSecret, amount } = location.state || {};

  if (!sessionId || !clientSecret || !amount) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Invalid session details. Please try booking again.
        </div>
      </div>
    );
  }

  const handlePaymentSuccess = async () => {
    // Fetch session details to get developerId
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:5000/api/sessions/detail/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const session = response.data.session;
    const developerId = session.developerId?._id || session.developerId;
    // Navigate to BookSession page for this developer
    navigate(`/booksession/${developerId}`);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">Session Payment</h2>
              
              <div className="mb-4">
                <h5>Amount to Pay: PKR {amount}</h5>
                <p className="text-warning" style={{ fontSize: '0.95rem' }}>
                  Note: You will be charged in USD equivalent to the PKR amount shown above.
                </p>
              </div>

              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  clientSecret={clientSecret}
                  amount={amount}
                  sessionId={sessionId}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-element-container {
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background-color: #f8f9fa;
        }

        .payment-form {
          max-width: 500px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default SessionPayment;
