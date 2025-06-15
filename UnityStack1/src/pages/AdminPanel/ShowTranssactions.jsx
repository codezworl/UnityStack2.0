import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaClock, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    onHold: 0,
    released: 0,
    failed: 0,
    platformRevenue: 0
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/transactions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTransactions(response.data.transactions);
        
        // Calculate statistics
        const stats = {
          total: response.data.transactions.length,
          onHold: response.data.transactions.filter(t => 
            (t.type === 'Project' && t.paymentStatus === 'paid') || 
            (t.type === 'Session' && t.paymentStatus === 'completed')
          ).length,
          released: response.data.transactions.filter(t => t.paymentStatus === 'released').length,
          failed: response.data.transactions.filter(t => t.paymentStatus === 'failed').length,
          platformRevenue: response.data.transactions
            .filter(t => t.paymentStatus === 'released')
            .reduce((sum, t) => sum + (t.amount * 0.1), 0)
        };
        setStatistics(stats);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to fetch transactions');
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === "All") return matchesSearch;
    if (filterStatus === "On Hold") return matchesSearch && t.paymentStatus === 'completed' && t.status === 'completed';
    return matchesSearch && t.paymentStatus === filterStatus;
  });

  // Function to handle verification
  const handleVerify = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Function to handle payment release
  const handleReleasePayment = async (transaction) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/transactions/${transaction._id}/release`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to release payment');
      }

      // Update local state
      const updatedTransactions = transactions.map((t) =>
        t._id === transaction._id ? { ...t, paymentStatus: 'released' } : t
      );
      setTransactions(updatedTransactions);
      
      setNotifications([
        ...notifications,
        {
          id: Date.now(),
          message: `Payment released for ${transaction.user}`,
          type: 'success'
        },
      ]);

      // Refresh transactions to update stats
      fetchTransactions();
    } catch (error) {
      setNotifications([
        ...notifications,
        { id: Date.now(), message: error.message, type: "error" },
      ]);
    }
  };

  // Function to handle payment cancellation
  const handleCancelPayment = async (transaction) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/transactions/${transaction._id}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel payment');
      }

      // Update local state
      const updatedTransactions = transactions.map((t) =>
        t._id === transaction._id ? { ...t, paymentStatus: 'failed' } : t
      );
      setTransactions(updatedTransactions);
      
      setNotifications([
        ...notifications,
        {
          id: Date.now(),
          message: `Payment cancelled for ${transaction.user}`,
          type: 'success'
        },
      ]);

      // Refresh transactions to update stats
      fetchTransactions();
    } catch (error) {
      setNotifications([
        ...notifications,
        { id: Date.now(), message: error.message, type: "error" },
      ]);
    }
  };

  // Dialog box for verification
  const VerificationDialog = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        <h3>Verify Payment for {transaction.user}</h3>
        <p>
          <strong>Date:</strong> {transaction.date}
        </p>
        <p>
          <strong>Amount:</strong> {transaction.amount}
        </p>
        <p>
          <strong>Type:</strong> {transaction.type}
        </p>
        <p>
          <strong>Status:</strong> {transaction.status}
        </p>
        <p>
          <strong>Total:</strong> {transaction.total}
        </p>
        <button
          onClick={() => {
            setNotifications([
              ...notifications,
              {
                id: Date.now(),
                message: `Payment verified for ${transaction.user}`,
              },
            ]);
            onClose();
          }}
          style={{
            marginRight: "10px",
            padding: "8px 12px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Verify
        </button>
        <button
          onClick={onClose}
          style={{
            padding: "8px 12px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Cancel
        </button>
      </div>
    );
  };

  // Helper function for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Helper function for payment status colors
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'warning'; // On Hold
      case 'released':
        return 'success';
      case 'failed':
        return 'danger';
      case 'pending':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Transactions</h5>
              <h2 className="card-text">{statistics.total}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Payments On Hold</h5>
              <h2 className="card-text">{statistics.onHold}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Released Payments</h5>
              <h2 className="card-text">{statistics.released}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Platform Revenue</h5>
              <h2 className="card-text">PKR {statistics.platformRevenue.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="On Hold">On Hold</option>
            <option value="released">Released</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>User</th>
              <th>Developer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${transaction.type === 'Project' ? 'bg-primary' : 'bg-success'}`}>
                    {transaction.type}
                  </span>
                </td>
                <td>{transaction.user}</td>
                <td>{transaction.developer}</td>
                <td>PKR {transaction.amount}</td>
                <td>
                  <span className={`badge bg-${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </td>
                <td>
                  <span className={`badge bg-${getPaymentStatusColor(transaction.paymentStatus)}`}>
                    {transaction.paymentStatus === 'completed' ? 'On Hold' : transaction.paymentStatus}
                  </span>
                </td>
                <td>
                  {((transaction.type === 'Project' && transaction.paymentStatus === 'paid') ||
                    (transaction.type === 'Session' && transaction.paymentStatus === 'completed')) && (
                    <div className="btn-group">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleReleasePayment(transaction._id)}
                      >
                        Release
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelPayment(transaction._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notifications */}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px 20px",
            backgroundColor: notification.type === "error" ? "#dc3545" : "#28a745",
            color: "white",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          {notification.message}
        </div>
      ))}

      {/* Verification Dialog */}
      {selectedTransaction && (
        <VerificationDialog
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

// Styles
const statCardStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const statIconStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  backgroundColor: "#E3F2FD",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  color: "#1976D2",
};

const statTitleStyle = {
  fontSize: "16px",
  color: "#666",
  margin: "0 0 5px 0",
};

const statValueStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#333",
  margin: "0 0 5px 0",
};

const statSubtitleStyle = {
  fontSize: "14px",
  color: "#999",
  margin: 0,
};

const tableContainerStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  marginTop: "20px",
};

const tableHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const filterContainerStyle = {
  display: "flex",
  gap: "10px",
};

const searchInputStyle = {
  padding: "8px 12px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "14px",
};

const filterSelectStyle = {
  padding: "8px 12px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "14px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const tableRowStyle = (isHeader) => ({
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
  padding: "12px",
  borderBottom: "1px solid #eee",
  backgroundColor: isHeader ? "#f8f9fa" : "transparent",
  fontWeight: isHeader ? "bold" : "normal",
});

const tableCellStyle = {
  padding: "8px",
  display: "flex",
  alignItems: "center",
};

const actionButtonStyle = {
  padding: "6px 12px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#007bff",
  color: "white",
  cursor: "pointer",
  fontSize: "14px",
};

const getStatusStyle = (status) => ({
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "bold",
  backgroundColor:
    status === "paid"
      ? "#D4EDDA"
      : status === "on_hold"
      ? "#FFF3CD"
      : status === "released"
      ? "#CCE5FF"
      : "#F8D7DA",
  color:
    status === "paid"
      ? "#155724"
      : status === "on_hold"
      ? "#856404"
      : status === "released"
      ? "#004085"
      : "#721C24",
});

const notificationsContainerStyle = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  zIndex: 1000,
};

const notificationStyle = {
  padding: "12px 20px",
  borderRadius: "4px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  animation: "slideIn 0.3s ease-out",
};

export default TransactionsPage;
