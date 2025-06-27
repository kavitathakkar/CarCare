import React, { useState, useEffect } from "react";
import axios from "axios";

let url = "http://localhost:3000/bookings/";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [errMsg, setErrMessage] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deleteFailure, setDeleteFailure] = useState("");

  function fetchBookings() {
    axios
      .get(url)
      .then((res) => {
        setBookings(res.data);
        setErrMessage("");
      })
      .catch(() => {
        setErrMessage("Get Data Failure");
      });
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAction = (id) => {
    axios
      .delete(url + id)
      .then(() => {
        setDeleteSuccess(`Booking with ID ${id} is successfully deleted`);
        setDeleteFailure("");
        fetchBookings(); // Refresh the list
      })
      .catch(() => {
        setDeleteFailure("Something went wrong, Booking not deleted");
        setDeleteSuccess("");
      });
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        opacity: "0.95",
        margin: "50px 10%",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>List of All Bookings</h1>

      {errMsg && <p className="text-danger" data-testid="errMsg">{errMsg}</p>}
      {deleteSuccess && <p className="text-success" data-testid="deleteSuccessMsg">{deleteSuccess}</p>}
      {deleteFailure && <p className="text-danger" data-testid="deleteFailureMsg">{deleteFailure}</p>}

      <div className="booking-grid">
        {bookings.map((booking) => (
          <div className="card" key={booking.id}>
            <h4 className="card-header" data-testid="bookingId">Booking id: {booking.id}</h4>
            <div className="card-body">
              <p>Service Name: {booking.serviceName}</p>
              <p>Email Id: {booking.emailId}</p>
              <p>Booking Date: {booking.bookedOn}</p>
              <button
                className="btn btn-secondary"
                data-testid="delete-button"
                onClick={() => handleAction(booking.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBookings;
