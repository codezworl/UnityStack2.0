import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';

// Initialize Stripe with your publishable key


const PaymentForm = ({ clientSecret, project, onSuccess }) => {
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
            name: project.title,
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
        const pkrAmount = project.acceptedBidAmount;
        if (!pkrAmount) {
          throw new Error('No accepted bid amount found for this project');
        }
        const usdAmount = +(pkrAmount / PKR_TO_USD).toFixed(2);
        
        // Add detailed logging
        console.log('Project details:', {
          id: project._id,
          title: project.title,
          developerId: project.developerId,
          assignedDeveloper: project.assignedDeveloper,
          acceptedBidAmount: project.acceptedBidAmount,
          budget: project.budget
        });
        
        console.log('Payment details:', {
          paymentIntentId: paymentIntent.id,
          amount: usdAmount,
          pkrAmount: pkrAmount
        });

        // Confirm payment on backend
        const paymentData = {
          projectId: project._id,
          paymentIntentId: paymentIntent.id,
          amount: usdAmount,
          developerId: project.developerId || project.assignedDeveloper // Try both fields
        };
        
        console.log('Sending to /confirm-payment:', paymentData);
        const response = await axios.post(
          'http://localhost:5000/api/payments/confirm-payment',
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.success || response.data.payment) {
          toast.success('Payment successful!');
          onSuccess();
        } else {
          toast.error('Payment confirmation failed on server.');
        }
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
        {loading ? 'Processing...' : `Pay PKR ${project.acceptedBidAmount || project.budget}`}
      </button>
    </form>
  );
};

const Payment = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data) {
          const projectData = response.data;
          setProject(projectData);
          
          // --- Currency conversion ---
          const PKR_TO_USD = 280; // Fixed conversion rate
          const pkrAmount = projectData.acceptedBidAmount;
          if (!pkrAmount) {
            throw new Error('No accepted bid amount found for this project');
          }
          const usdAmount = +(pkrAmount / PKR_TO_USD).toFixed(2); // Convert to USD with 2 decimal places
          
          console.log('Creating payment intent with data:', {
            projectId,
            amount: usdAmount,
            developerId: projectData.developerId || projectData.assignedDeveloper?._id,
            projectData: projectData,
            pkrAmount,
            usdAmount
          });

          const paymentResponse = await axios.post(
            'http://localhost:5000/api/payments/create-payment-intent',
            {
              projectId,
              amount: usdAmount,
              developerId: projectData.developerId || projectData.assignedDeveloper?._id || projectData.assignedDeveloper
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          if (paymentResponse.data && paymentResponse.data.clientSecret) {
            setClientSecret(paymentResponse.data.clientSecret);
          } else {
            setError(paymentResponse.data?.message || 'Failed to get client secret for payment.');
          }
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err.response?.data?.message || 'Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, navigate]);

  const handlePaymentSuccess = () => {
    navigate('/projects');
  };

  console.log('Payment component state:', {
    loading,
    error,
    project: project ? 'loaded' : 'null/undefined',
    clientSecret: clientSecret ? 'loaded' : 'null/undefined',
  });

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  if (!project || !clientSecret) {
    return <div className="alert alert-warning m-4">Project details not found.</div>;
  }

  console.log('clientSecret:', clientSecret); // Diagnostic log

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">Payment Details</h2>

              <div className="mb-4">
                <h5>Project: {project.title}</h5>
                <p className="text-muted">Amount: PKR {project.acceptedBidAmount || project.budget}</p>
                <p className="text-warning" style={{ fontSize: '0.95rem' }}>
                  Note: You will be charged in USD equivalent to the PKR amount shown above.
                </p>
              </div>

              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  clientSecret={clientSecret}
                  project={project}
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
          border: 1px solid red; /* Added for debugging */
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
