import React, { Component } from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import "./App.css";
import AllBooking from './components/allBookings';
import BookingComponent from "./components/createBooking";

const App = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-custom">
        <span className="navbar-brand">MY CAR CARE</span>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Book Service</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/allBookings">View Bookings</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<BookingComponent />} />
        <Route path="/allBookings" element={<AllBooking />} />
      </Routes>
    </div>
  );
};

export default App;