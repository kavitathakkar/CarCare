import React, { useState } from "react";
import { validation } from "../validators/validation";
import axios from "axios";
import { useNavigate } from "react-router-dom";

let url = "http://localhost:3000/bookings";

const BookingComponent = () => {
    const [state, setState] = useState({
        serviceName: "",
        bookedOn: "",
        emailId: ""
    });

    const [formErrors, setFormErrors] = useState({
        emailIdError: "",
        serviceNameError: "",
        bookedOnError: ""
    });

    const [mandatory, setMandatory] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [valid, setValid] = useState(false);

    const navigate = useNavigate();

    const messages = {
        EMAILID_ERROR: "Please enter valid email",
        SERVICE_NAME_ERROR: "Please select Service name",
        BOOKED_ON_ERROR: "Booking date should be after today's date",
        ERROR: "Something went wrong",
        MANDATORY: "Enter all the form fields"
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!state.serviceName || !state.bookedOn || !state.emailId) {
            setMandatory(true);
            return;
        }

        setMandatory(false);

        axios.post(url, state)
            .then((res) => {
                setSuccessMessage(`Booking is successfully created with bookingId: ${res.data.id}`);
                setErrorMessage('');
                setState({ serviceName: "", bookedOn: "", emailId: "" }); // Reset form

                // Redirect after short delay
                setTimeout(() => {
                    navigate("/allBookings");
                }, 1500);
            })
            .catch(() => {
                setErrorMessage(messages.ERROR);
                setSuccessMessage('');
            });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setState({ ...state, [name]: value });
        validateField(name, value);
    };

    const validateField = (name, value) => {
        const updatedErrors = { ...formErrors };

        switch (name) {
            case "serviceName":
                updatedErrors.serviceNameError = validation.validateService(value)
                    ? ""
                    : messages.SERVICE_NAME_ERROR;
                break;

            case "emailId":
                updatedErrors.emailIdError = validation.validateEmail(value)
                    ? ""
                    : messages.EMAILID_ERROR;
                break;

            case "bookedOn":
                updatedErrors.bookedOnError = validation.validDate(value)
                    ? ""
                    : messages.BOOKED_ON_ERROR;
                break;

            default:
                break;
        }

        setFormErrors(updatedErrors);

        const allValid = Object.values(updatedErrors).every(err => err === "");
        setValid(allValid);
    };

    return (
        <React.Fragment>
            <div className="CreateBooking">
                <div className="row">
                    <div>
                        <br />
                        <div className="card" style={{ width: "500px" }}>
                            <div className="card-header">Book Your Service</div>
                            <div className="card-body">
                                <form
                                    className="form"
                                    data-testid="newbooking-form"
                                    noValidate
                                    onSubmit={handleSubmit}
                                >
                                    {/* Service Name */}
                                    <div className="form-group">
                                        <label>Type of Service</label>
                                        <select
                                            name="serviceName"
                                            data-testid="serviceName"
                                            className="form-control"
                                            value={state.serviceName}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select a Service</option>
                                            <option value="Car Wash">Car Wash</option>
                                            <option value="Denting and Painting">Denting and Painting</option>
                                            <option value="Clutch Replacement">Clutch Replacement</option>
                                            <option value="Wheel Alignment">Wheel Alignment</option>
                                        </select>
                                        {formErrors.serviceNameError && (
                                            <span data-testid="serviceName-Error" className="text-danger">
                                                {formErrors.serviceNameError}
                                            </span>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="form-group">
                                        <label>Email Id</label>
                                        <input
                                            type="email"
                                            data-testid="emailId"
                                            name="emailId"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            value={state.emailId}
                                            onChange={handleChange}
                                            required
                                        />
                                        {formErrors.emailIdError && (
                                            <span data-testid="email-error" className="text-danger">
                                                {formErrors.emailIdError}
                                            </span>
                                        )}
                                    </div>

                                    {/* Booking Date */}
                                    <div className="form-group">
                                        <label>Booking Date</label>
                                        <input
                                            type="date"
                                            data-testid="bookedOn"
                                            name="bookedOn"
                                            className="form-control"
                                            value={state.bookedOn}
                                            onChange={handleChange}
                                            required
                                        />
                                        {formErrors.bookedOnError && (
                                            <span data-testid="bookingDate-error" className="text-danger">
                                                {formErrors.bookedOnError}
                                            </span>
                                        )}
                                    </div>

                                    <br />
                                    <button
                                        data-testid="button"
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{
                                            color: "white",
                                            fontWeight: "bold"
                                        }}
                                        disabled={!valid}
                                    >
                                        Book
                                    </button>

                                    {mandatory && (
                                        <div className="text-danger" data-testid="mandatory">
                                            {messages.MANDATORY}
                                        </div>
                                    )}

                                    {successMessage && (
                                        <div className="text-success" data-testid="success">
                                            {successMessage}
                                        </div>
                                    )}

                                    {errorMessage && (
                                        <div className="text-danger" data-testid="error">
                                            {errorMessage}
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BookingComponent;
