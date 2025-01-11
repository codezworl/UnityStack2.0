import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/header";
import StudentSidebar from "./StudentSidebar";

const ScheduleSession = () => {
  const sessions = [
    {
      date: "2025-01-15",
      mentor: "Samir Habib Zahmani",
      cost: "PKR 7,500", // Updated cost to PKR
      startTime: "10:00 AM",
      endTime: "11:00 AM", // Added end time
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
          <h3 className="mb-4">Scheduled Sessions</h3>
          <div className="card shadow-sm">
            <div className="card-body">
              <table className="table table-striped">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Session Date</th>
                    <th scope="col">Session Mentor</th>
                    <th scope="col">Session Cost</th>
                    <th scope="col">Start Time</th>
                    <th scope="col">End Time</th> {/* Added column header */}
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, index) => (
                    <tr key={index}>
                      <td>{session.date}</td>
                      <td>{session.mentor}</td>
                      <td>{session.cost}</td>
                      <td>{session.startTime}</td>
                      <td>{session.endTime}</td> {/* Displayed end time */}
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            alert(`Viewing session with ${session.mentor}`)
                          }
                        >
                          View
                        </button>
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

export default ScheduleSession;
