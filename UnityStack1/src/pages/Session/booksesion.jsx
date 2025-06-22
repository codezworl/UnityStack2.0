import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookSession = () => {
  const { developerId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    hours: 1,
    date: new Date().toISOString().split('T')[0]
  });
  const [developer, setDeveloper] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadyBooked, setAlreadyBooked] = useState(false);

  // Format time to AM/PM
  const formatTimeSlot = (timeSlot) => {
    const [start, end] = timeSlot.split(' - ');
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  // Check if time slot is in the past for same-day bookings
  const isTimeSlotValid = (timeSlot) => {
    const today = new Date().toISOString().split('T')[0];
    if (formData.date === today) {
      const [startTime] = timeSlot.split(' - ');
      const [hours, minutes] = startTime.split(':');
      const slotTime = new Date();
      slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const currentTime = new Date();
      return slotTime > currentTime;
    }
    return true;
  };

  useEffect(() => {
    const fetchDeveloperDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/developers/${developerId}`);
        setDeveloper(response.data);
      } catch (error) {
        toast.error('Error fetching developer details');
      }
    };

    fetchDeveloperDetails();
  }, [developerId]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/sessions/available-slots?developerId=${developerId}&date=${formData.date}&hours=${formData.hours}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        // Filter out past time slots for same-day bookings
        const validSlots = response.data.availableSlots.filter(isTimeSlotValid);
        setAvailableSlots(validSlots);
      } catch (error) {
        toast.error('Error fetching available time slots');
      }
    };

    if (formData.date && formData.hours) {
      fetchAvailableSlots();
    }
  }, [developerId, formData.date, formData.hours]);

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const userData = JSON.parse(atob(token.split('.')[1]));
        const studentId = userData.id || userData._id;
        const response = await axios.get(
          `http://localhost:5000/api/sessions/student-developer-session?studentId=${studentId}&developerId=${developerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data && response.data.hasActiveSession) {
          setAlreadyBooked(true);
        } else {
          setAlreadyBooked(false);
        }
      } catch (error) {
        setAlreadyBooked(false);
      }
    };
    checkExistingSession();
  }, [developerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHoursChange = (e) => {
    const hours = parseInt(e.target.value);
    setFormData(prev => ({
      ...prev,
      hours
    }));
    setSelectedTimeSlot(''); // Reset selected time slot when hours change
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTimeSlot) {
      toast.error('Please select a time slot');
      return;
    }

    setLoading(true);
    try {
      const amount = developer.hourlyRate * formData.hours;
      const response = await axios.post(
        'http://localhost:5000/api/sessions/create',
        {
          ...formData,
          developerId,
          startTime: selectedTimeSlot,
          amount
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      // Navigate to payment page with session details
      navigate('/sessionpayment', {
        state: {
          sessionId: response.data.session._id,
          clientSecret: response.data.clientSecret,
          amount
        }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating session');
    } finally {
      setLoading(false);
    }
  };

  if (!developer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">Book a Session</h2>
              {alreadyBooked && (
                <div className="alert alert-warning">
                  You already booked a session with this developer. Please complete it first.
                </div>
              )}
              <div className="mb-4">
                <h5>Developer: {developer.firstName} {developer.lastName}</h5>
                <p>Hourly Rate: PKR {developer.hourlyRate}</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    disabled={alreadyBooked}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                    disabled={alreadyBooked}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    disabled={alreadyBooked}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Number of Hours</label>
                  <select
                    className="form-control"
                    name="hours"
                    value={formData.hours}
                    onChange={handleHoursChange}
                    required
                    disabled={alreadyBooked}
                  >
                    <option value="1">1 Hour</option>
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label">Available Time Slots</label>
                  <div className="d-flex flex-wrap gap-2">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          className={`btn ${selectedTimeSlot === slot ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleTimeSlotSelect(slot)}
                          disabled={alreadyBooked}
                        >
                          {formatTimeSlot(slot)}
                        </button>
                      ))
                    ) : (
                      <div className="alert alert-info w-100">
                        No available time slots for the selected date and duration.
                      </div>
                    )}
                  </div>
                </div>
                {selectedTimeSlot && !alreadyBooked && (
                  <div className="alert alert-info">
                    Total Amount: PKR {developer.hourlyRate * formData.hours}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || !selectedTimeSlot || alreadyBooked}
                >
                  {loading ? 'Processing...' : 'Book Now'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSession;