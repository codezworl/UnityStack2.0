import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { FiDollarSign, FiPercent, FiDownload } from 'react-icons/fi';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51RL6m0I2RrNQfuPDoaSkTwq4vG73aSFJgtYtXGA15SLfdM8xea8JulLwfRfYfUlHzQVf3ys9erWc7vbUiD1Jw6Gt00mniCOHay');

// Payment Form Component
const PaymentForm = ({ project, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (submitError) {
        setError(submitError.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      {error && <div className="text-danger mt-2">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary mt-3 w-100"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

// Withdrawal Details Modal Component
const WithdrawalModal = ({ show, onClose, onSubmit, project, withdrawalAmount }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    swiftCode: '',
    routingNumber: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">Withdrawal Details</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-info">
              <h6>Withdrawal Summary</h6>
              <p><strong>Project:</strong> {project.title}</p>
              <p><strong>Amount:</strong> PKR {withdrawalAmount?.toLocaleString()}</p>
              <p><strong>Platform Fee (10%):</strong> PKR {(withdrawalAmount * 0.10).toLocaleString()}</p>
              <p><strong>Net Amount:</strong> PKR {(withdrawalAmount * 0.90).toLocaleString()}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your bank name"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter your account number"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Account Holder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    required
                    placeholder="Enter account holder name"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">SWIFT Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={handleChange}
                    required
                    placeholder="Enter SWIFT code"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Routing Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter routing number"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const WithdrawalForm = ({ project, onSuccess }) => {
  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    swiftCode: '',
    routingNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // PKR to USD conversion rate (you should get this from an API in production)
  const PKR_TO_USD_RATE = 0.0036; // Example rate: 1 PKR = 0.0036 USD

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to withdraw.');
        return;
      }
      
      // Calculate amounts in PKR
      const totalAmountPKR = project.acceptedBidAmount || project.budget;
      const platformFeePKR = totalAmountPKR * 0.10;
      const releasedAmountPKR = totalAmountPKR - platformFeePKR;

      // Convert to USD for Stripe
      const releasedAmountUSD = releasedAmountPKR * PKR_TO_USD_RATE;

      const response = await axios.post(
        `http://localhost:5000/api/projects/${project._id}/withdraw`,
        {
          ...formData,
          amountUS: releasedAmountUSD,
          amountPKR: releasedAmountPKR
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        toast.success('Withdrawal request submitted successfully');
        onSuccess(response.data);
      }
    } catch (err) {
      console.error('Error submitting withdrawal:', err);
      setError(err.response?.data?.message || 'Failed to submit withdrawal request');
      toast.error('Failed to submit withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = project.acceptedBidAmount || project.budget;
  const platformFee = totalAmount * 0.10;
  const releasedAmount = totalAmount - platformFee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Withdrawal Details</h2>
      
      {/* Amount Breakdown */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-semibold">PKR {totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Platform Fee (10%):</span>
          <span className="text-red-600">- PKR {platformFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-gray-800 font-semibold">Released Amount:</span>
          <span className="text-green-600 font-bold">PKR {releasedAmount.toLocaleString()}</span>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          (Will be converted to USD for withdrawal)
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Holder Name
          </label>
          <input
            type="text"
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Number
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SWIFT Code
          </label>
          <input
            type="text"
            name="swiftCode"
            value={formData.swiftCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Routing Number
          </label>
          <input
            type="text"
            name="routingNumber"
            value={formData.routingNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Submit Withdrawal Request'}
        </button>
      </form>
    </motion.div>
  );
};

const Invoiceget = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) {
        setError('Project ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in.');
          setLoading(false);
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data) {
          const fetchedProject = response.data;
          setProject(fetchedProject);

          // Calculate withdrawal amount on the frontend (optional, but good for display)
          const totalAmount = fetchedProject.acceptedBidAmount || fetchedProject.budget;
          if (totalAmount && totalAmount > 0) {
            const platformFee = totalAmount * 0.10;
            setWithdrawalAmount(totalAmount - platformFee);
          }

        } else {
          setError('Project details not found.');
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

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to make payment.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/payments/create-payment-intent',
        {
          projectId,
          amount: project.acceptedBidAmount || project.budget
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClientSecret(response.data.clientSecret);
      setShowPaymentForm(true);
    } catch (err) {
      console.error('Error initiating payment:', err);
      toast.error(err.response?.data?.message || 'Failed to initiate payment.');
    }
  };

  const handleWithdraw = async (withdrawalDetails) => {
    if (!project || withdrawing) return;

    setWithdrawing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to withdraw.');
        setWithdrawing(false);
        return;
      }

      // Calculate amounts
      const totalAmount = project.acceptedBidAmount || project.budget;
      const platformFee = totalAmount * 0.10;
      const releasedAmount = totalAmount - platformFee;

      const response = await axios.post(
        `http://localhost:5000/api/projects/${projectId}/withdraw`,
        {
          ...withdrawalDetails,
          amountPKR: releasedAmount,
          amountUS: releasedAmount * 0.0036 // Convert to USD
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Withdrawal successful! Invoice has been generated.');
        // Update project status
        setProject({...project, paymentStatus: 'released'});
        
        // Navigate to respective dashboard based on user role
        const userRole = localStorage.getItem('userRole');
        switch(userRole) {
          case 'developer':
            navigate('/developerdashboard');
            break;
          case 'student':
            navigate('/studentdashboard');
            break;
          case 'organization':
            navigate('/companydashboard');
            break;
          default:
            navigate('/findwork?tab=invoices');
        }
      }
    } catch (err) {
      console.error('Error requesting withdrawal:', err);
      toast.error(err.response?.data?.message || 'Failed to request withdrawal.');
    } finally {
      setWithdrawing(false);
    }
  };

  // Get the client name
  const getClientName = () => {
    if (project?.companyId?.companyName) return project.companyId.companyName;
    if (project?.userId?.firstName && project?.userId?.lastName) return `${project.userId.firstName} ${project.userId.lastName}`;
     if (project?.developerId?.firstName && project?.developerId?.lastName) return `${project.developerId.firstName} ${project.developerId.lastName}`;
    return "N/A";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/findwork')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Find Work
          </button>
        </div>
      </div>
    );
  }

  // Check if project is completed and paid for withdrawal
  const isEligibleForWithdrawal = project.status === 'completed' && project.paymentStatus === 'paid';
  const isWithdrawalReleased = project.paymentStatus === 'released';
  const needsPayment = project.paymentStatus === 'pending';

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Withdraw Earnings</h1>
              
              {project && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h2>
                  <p className="text-gray-600">{project.description}</p>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Payment Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold">PKR {(project.acceptedBidAmount || project.budget).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform Fee (10%):</span>
                        <span className="text-red-600">- PKR {((project.acceptedBidAmount || project.budget) * 0.1).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-800 font-semibold">Net Amount:</span>
                        <span className="text-green-600 font-bold">PKR {((project.acceptedBidAmount || project.budget) * 0.9).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {project && <WithdrawalForm project={project} onSuccess={handleWithdraw} />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Invoiceget;
