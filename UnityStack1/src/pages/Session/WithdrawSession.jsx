import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/header';

const WithdrawSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    swiftCode: '',
    routingNumber: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/sessions/detail/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSession(response.data.session);
      } catch (error) {
        console.error('Error fetching session:', error);
        toast.error('Failed to fetch session details');
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
    if (!formData.swiftCode.trim()) newErrors.swiftCode = 'SWIFT code is required';
    if (!formData.routingNumber.trim()) newErrors.routingNumber = 'Routing number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to withdraw');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/sessions/${sessionId}/withdraw`,
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        toast.success('Withdrawal request submitted successfully');
        navigate('/devsessions');
      }
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      if (error.response?.status === 403) {
        toast.error('You are not authorized to withdraw for this session');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Session not eligible for withdrawal');
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit withdrawal request');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Session Not Found</h2>
          <button
            onClick={() => navigate('/devsessions')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Sessions
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = session.amount;
  const platformFee = totalAmount * 0.10;
  const netAmount = totalAmount - platformFee;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Withdraw Session Earnings</h1>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{session.title}</h2>
                <p className="text-gray-600">{session.description}</p>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-3">Payment Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee (10%):</span>
                      <span className="font-medium">-${platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-800 font-semibold">Net Amount:</span>
                      <span className="text-gray-800 font-semibold">${netAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      id="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.bankName ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.bankName && (
                      <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.accountNumber ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.accountNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      id="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.accountHolderName ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.accountHolderName && (
                      <p className="mt-1 text-sm text-red-600">{errors.accountHolderName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700">
                      SWIFT Code
                    </label>
                    <input
                      type="text"
                      name="swiftCode"
                      id="swiftCode"
                      value={formData.swiftCode}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.swiftCode ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.swiftCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.swiftCode}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      name="routingNumber"
                      id="routingNumber"
                      value={formData.routingNumber}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.routingNumber ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.routingNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.routingNumber}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/devsessions')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawSession; 