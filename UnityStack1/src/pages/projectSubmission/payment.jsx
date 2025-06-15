import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51RL6m0I2RrNQfuPDoaSkTwq4vG73aSFJgtYtXGA15SLfdM8xea8JulLwfRfYfUlHzQVf3ys9erWc7vbUiD1Jw6Gt00mniCOHay');

const PaymentForm = ({ clientSecret, project, session, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);

  // Handle card input changes and validation errors
  const handleCardChange = (event) => {
    setError(event.error ? event.error.message : null);
    setCardComplete(event.complete);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet. Please wait.");
      return;
    }

    if (!cardComplete) {
      toast.error("Please complete your card details.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: project ? project.title : session.title,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Debug: Log details sent to backend
        const PKR_TO_USD = 280;
        let pkrAmount;
        let paymentData = {};

        if (project) {
          // Project payment handling
          pkrAmount = project.acceptedBidAmount;
          if (!pkrAmount) {
            throw new Error('No accepted bid amount found for this project');
          }
          const usdAmount = +(pkrAmount / PKR_TO_USD).toFixed(2);
          
          paymentData = {
            projectId: project._id,
            paymentIntentId: paymentIntent.id,
            amount: usdAmount,
            developerId: project.developerId || project.assignedDeveloper
          };
          
          // Confirm project payment
          await axios.post(
            'http://localhost:5000/api/payments/confirm-payment',
            paymentData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
        } else if (session) {
          // Session payment handling
          pkrAmount = session.amount;
          if (!pkrAmount) {
            throw new Error('No amount found for this session');
          }
          const usdAmount = +(pkrAmount / PKR_TO_USD).toFixed(2);
          
          paymentData = {
            sessionId: session._id,
            paymentIntentId: paymentIntent.id,
            amount: usdAmount,
            developerId: session.developerId
          };
          
          // Confirm session payment
          await axios.post(
            'http://localhost:5000/api/sessions/confirm-payment',
            paymentData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
        }

        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err.response?.data || err.message || err);
      setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
      toast.error(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
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
            onChange={handleCardChange}
          />
        </div>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={!stripe || loading || !cardComplete}
      >
        {loading ? 'Processing...' : `Pay PKR ${project ? project.acceptedBidAmount : session.amount}`}
      </button>
    </form>
  );
};

const Payment = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [session, setSession] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Check if this is a session payment
        if (location.state?.sessionId) {
          const response = await axios.get(
            `http://localhost:5000/api/sessions/detail/${location.state.sessionId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          setSession(response.data.session);
          
          // Create payment intent for session
          const PKR_TO_USD = 280;
          const pkrAmount = response.data.session.amount;
          const usdAmount = +(pkrAmount / PKR_TO_USD).toFixed(2);
          
          const paymentResponse = await axios.post(
            'http://localhost:5000/api/sessions/create-payment-intent',
            {
              sessionId: location.state.sessionId,
              amount: usdAmount,
              developerId: response.data.session.developerId
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (paymentResponse.data && paymentResponse.data.clientSecret) {
            setClientSecret(paymentResponse.data.clientSecret);
          }
        } else {
          // Project payment handling
          const response = await axios.get(
            `http://localhost:5000/api/projects/${projectId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (response.data) {
            const projectData = response.data;
            setProject(projectData);
            
            const PKR_TO_USD = 280;
            const pkrAmount = projectData.acceptedBidAmount;
            if (!pkrAmount) {
              throw new Error('No accepted bid amount found for this project');
            }
            const usdAmount = +(pkrAmount / PKR_TO_USD).toFixed(2);
            
            const paymentResponse = await axios.post(
              'http://localhost:5000/api/payments/create-payment-intent',
              {
                projectId,
                amount: usdAmount,
                developerId: projectData.developerId || projectData.assignedDeveloper?._id
              },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            if (paymentResponse.data && paymentResponse.data.clientSecret) {
              setClientSecret(paymentResponse.data.clientSecret);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching details:', err);
        setError(err.response?.data?.message || 'Failed to load details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [projectId, location.state, navigate]);

  const handlePaymentSuccess = () => {
    if (session) {
      navigate('/SessionHistory');
    } else {
      navigate('/projects');
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  if ((!project && !session) || !clientSecret) {
    return <div className="alert alert-warning m-4">Details not found.</div>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">Payment Details</h2>

              <div className="mb-4">
                <h5>{project ? 'Project' : 'Session'}: {project ? project.title : session.title}</h5>
                <p className="text-muted">Amount: PKR {project ? project.acceptedBidAmount : session.amount}</p>
                <p className="text-warning" style={{ fontSize: '0.95rem' }}>
                  Note: You will be charged in USD equivalent to the PKR amount shown above.
                </p>
              </div>

              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  clientSecret={clientSecret}
                  project={project}
                  session={session}
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

export default Payment;
