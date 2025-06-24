import React, { useState, useEffect } from "react";
import axios from "axios";

let url = "http://localhost:3000/bookings/";

const AllBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [errMsg, setErrMessage] = useState("")
    const [deleteSuccess, setDeleteSuccess] = useState("")
    const [deleteFailure, setDeleteFailure] = useState("")

    function fetchBookings() {
        axios.get(url)
            .then((res) => {
                setBookings(res.data)
            })
            .catch((err) => {
                setErrMessage("Get Data Failure")
            })
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    const handleAction = (id) => {
        // console.log(id)
        axios.delete(url + id)
            .then((res) => {
                setDeleteSuccess(`booking with ${id} is successfully deleted`)
                setDeleteFailure('')
            })
            .catch((err) => {
                setDeleteFailure("Something went wrong, Booking not deleted")
                setDeleteSuccess('')
            })
    };


    return (
        <div style={{ backgroundColor: "white", opacity: "0.95", marginTop: "50px", marginLeft: "10%", marginRight: "10%" }}>
            <h1>List of All Bookings</h1>
            {errMsg === '' ? null : <p className="text-danger" data-testid="errMsg">{errMsg}</p>}
            {deleteSuccess === '' ? null : <p className="text-success" data-testid="deleteSuccessMsg" style={{ left: "20px" }}>{deleteSuccess}</p>}
            {deleteFailure === '' ? null : <p className="text-danger" data-testid="deleteFailureMsg">{deleteFailure}</p>}

            {bookings.map((booking) => {
                return (
                    <div className="card" style={{ margin: "20px" }}>
                        {/* <h4 className="card-header" data-testid = "bookingId">Booking id: (booking.id)</h4> */}
                        <h4 className="card-header" data-testid="bookingId">Booking id: {booking.id}</h4>

                            < div className = "card-body" style = {{ padding: "10px" } }>
<p>Service Name: {booking.serviceName}</p>
<p>Email Id: {booking.emailId}</p>
<p>Booking Date: {booking.bookedOn}</p>

<button
className="btn btn-secondary"
data-testid="delete-button"
onClick={() => handleAction(booking.id)}
>Delete</button>
</div>
</div >
    )
})}
</div >
);
};

export default AllBookings;
