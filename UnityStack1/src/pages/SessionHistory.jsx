import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/header";
import StudentSidebar from "./StudentSidebar";

const SessionHistory = () => {
  const sessionHistory = [
    {
      date: "2025-01-10",
      expert: "Samir Habib Zahmani",
      cost: "PKR 7,500",
      duration: "1 hour",
      status: "Done", // Status of the session
    },
    {
      date: "2025-01-12",
      expert: "Jane Doe",
      cost: "PKR 5,000",
      duration: "30 minutes",
      status: "Done", // Status of the session
    },
    {
      date: "2025-01-20",
      expert: "John Smith",
      cost: "PKR 6,000",
      duration: "45 minutes",
      status: "Coming", // Status of the session
    },
  ];

  return (
    <>
      {/* Header */}
      <Header />

      <div className="d-flex">
        {/* Sidebar */}
        <div
          style={{
            width: "243px", // Adjusted sidebar width
            backgroundColor: "#f8f9fa",
            height: "100vh",
            borderRight: "1px solid #ddd",
          }}
        >
          <StudentSidebar />
        </div>

        {/* Main Content */}
        <div
          className="flex-grow-1"
          style={{
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#f4f6f9",
            marginLeft: "20px",
          }}
        >
          <h3 className="mb-4">Session History</h3>
          <div className="card shadow-sm">
            <div className="card-body">
              <table className="table table-striped">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Session Date</th>
                    <th scope="col">Session Expert</th>
                    <th scope="col">Session Cost</th>
                    <th scope="col">Session Duration</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionHistory.map((session, index) => (
                    <tr key={index}>
                      <td>{session.date}</td>
                      <td>{session.expert}</td>
                      <td>{session.cost}</td>
                      <td>{session.duration}</td>
                      <td>
                        <span
                          className={`badge ${
                            session.status === "Done"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionHistory;
