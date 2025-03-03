import React, { useState } from "react";

const transactions = [
  {
    id: 1,
    user: "John Doe",
    date: "2025-02-01",
    amount: "$150",
    type: "Session Request",
    status: "Payment Pending",
    total: "$150",
  },
  {
    id: 2,
    user: "Jane Smith",
    date: "2025-02-02",
    amount: "$200",
    type: "Session Request",
    status: "Payment On Hold",
    total: "$200",
  },
  {
    id: 3,
    user: "Mike Johnson",
    date: "2025-02-03",
    amount: "$100",
    type: "Session Request",
    status: "Payment Released",
    total: "$100",
  },
];

const TransactionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const filteredTransactions = transactions.filter((t) => {
    return (
      (filterStatus === "All" || t.status === filterStatus) &&
      (t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Function to handle verification
  const handleVerify = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Function to handle payment release
  const handleReleasePayment = (transaction) => {
    try {
      // Simulate API call or state update
      if (transaction.status === "Payment On Hold") {
        const updatedTransactions = transactions.map((t) =>
          t.id === transaction.id ? { ...t, status: "Payment Released" } : t
        );
        setNotifications([
          ...notifications,
          {
            id: Date.now(),
            message: `Payment released for ${transaction.user}`,
          },
        ]);
      } else {
        throw new Error("Payment must be on hold to release.");
      }
    } catch (error) {
      setNotifications([
        ...notifications,
        { id: Date.now(), message: error.message, type: "error" },
      ]);
    }
  };

  // Function to handle payment cancellation
  const handleCancelPayment = (transaction) => {
    try {
      if (
        transaction.status === "Payment Pending" ||
        transaction.status === "Payment On Hold"
      ) {
        const updatedTransactions = transactions.map((t) =>
          t.id === transaction.id ? { ...t, status: "Payment Cancelled" } : t
        );
        setNotifications([
          ...notifications,
          {
            id: Date.now(),
            message: `Payment cancelled for ${transaction.user}`,
          },
        ]);
      } else {
        throw new Error("Payment cannot be cancelled in this state.");
      }
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

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#F8F9FA",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Transactions</h1>

      {/* Summary Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px" }}>Total Revenue</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>
            $
            {transactions
              .reduce(
                (sum, t) => sum + parseFloat(t.amount.replace("$", "")),
                0
              )
              .toFixed(2)}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px" }}>Total Payments Out</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#FF4500" }}>
            $
            {transactions
              .filter((t) => t.status === "Payment Released")
              .reduce(
                (sum, t) => sum + parseFloat(t.amount.replace("$", "")),
                0
              )
              .toFixed(2)}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px" }}>Payments On Hold</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#FFA500" }}>
            {transactions.filter((t) => t.status === "Payment On Hold").length}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px" }}>Cancelled Payments</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: "#dc3545" }}>
            {
              transactions.filter((t) => t.status === "Payment Cancelled")
                .length
            }
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search user or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          <option value="All">All</option>
          <option value="Payment Pending">Payment Pending</option>
          <option value="Payment On Hold">Payment On Hold</option>
          <option value="Payment Released">Payment Released</option>
          <option value="Payment Cancelled">Payment Cancelled</option>
        </select>
      </div>

      {/* Notifications */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2>Notifications</h2>
        {notifications.slice(0, 3).map((notification) => (
          <div
            key={notification.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #eee",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor:
                  notification.type === "error" ? "#dc3545" : "#28a745",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              {notification.type === "error" ? "❌" : "✅"}
            </div>
            <p style={{ margin: 0 }}>{notification.message}</p>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          overflowX: "auto",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[
                "User",
                "Date",
                "Amount",
                "Type",
                "Status",
                "Total",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    backgroundColor: "#f8f9fa",
                    borderBottom: "1px solid #ddd",
                    fontWeight: "bold",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                style={{ borderBottom: "1px solid #eee" }}
              >
                <td style={{ padding: "10px" }}>{transaction.user}</td>
                <td style={{ padding: "10px" }}>{transaction.date}</td>
                <td style={{ padding: "10px" }}>{transaction.amount}</td>
                <td style={{ padding: "10px" }}>{transaction.type}</td>
                <td
                  style={{
                    padding: "10px",
                    color:
                      transaction.status === "Payment Released"
                        ? "#28a745"
                        : transaction.status === "Payment Pending"
                        ? "#FFA500"
                        : transaction.status === "Payment Cancelled"
                        ? "#dc3545"
                        : "#FF4500",
                  }}
                >
                  {transaction.status}
                </td>
                <td style={{ padding: "10px" }}>{transaction.total}</td>
                <td style={{ padding: "10px" }}>
                  {transaction.status !== "Payment Released" && (
                    <button
                      onClick={() => handleVerify(transaction)}
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        marginRight: "5px",
                        fontSize: "14px",
                      }}
                    >
                      Verify
                    </button>
                  )}
                  {transaction.status === "Payment On Hold" && (
                    <button
                      onClick={() => handleReleasePayment(transaction)}
                      style={{
                        backgroundColor: "#007BFF",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        marginRight: "5px",
                        fontSize: "14px",
                      }}
                    >
                      Release Payment
                    </button>
                  )}
                  {(transaction.status === "Payment Pending" ||
                    transaction.status === "Payment On Hold") && (
                    <button
                      onClick={() => handleCancelPayment(transaction)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Cancel Payment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTransaction && (
        <VerificationDialog
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
