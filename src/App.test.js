import App from "./App.js";
import React from "react";
import "@testing-library/jest-dom";
import BookingComponent from "/components/createBooking.js";
import AllBookings from "./components/allBookings.js";
import { rest } from "msw";
import { setupServer } from "msw/node";

const { render, screen, fireEvent } = require("@testing-library/react");

describe("Testing Routes in App Component", () => {
  it("should navigate to the Create Booking Component when path is /", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByTestId("bookingComponent-link"));
    expect(container.innerHTML).toMatch("Book Your Service");
  });
  it("should navigate to the All Bookings component", () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByTestId("allBookings-link"));
    expect(container.innerHTML).toMatch("List of All Bookings");
  });
});


describe("testing form input value attributes", () => {
  it("testing whether the value attribute is set to the Type of Service field", () => {
    render(<BookingComponent />);
    let input = screen.getByTestId("serviceName");
    fireEvent.change(input, { target: { value: "Car Wash" } });
    expect(input.value).toEqual("Car Wash");
  });
  it("testing whether the value attribute is set to the emailld input field", () => {
    render(<BookingComponent />);
    let input = screen.getByTestId("emailId");
    fireEvent.change(input, { target: { value: "lakshmi@gmail.com" } });
    expect(input, value).toEqual("lakshmi@gmail.com");
  });
  it("testing whether the value attribute is set to the date input field", () => {
    render(<BookingComponent />);
    let input = screen.getByTestId("bookedOn");
    fireEvent.change(input, { target: { value: "2025-10-14" } });
    expect(input.value).toEqual("2025-10-14");
  });
})


describe("Testing New Application component post http call", () => {
  const server = setupServer(
    rest.post("http://localhost:4000/bookings", (req, res, ctx) => {
      return res(
        ctx.json({
          id: 1005,
          serviceName: "Denting and Painting",
          bookedon: "2022-11-23",
          emailId: "Anita@gmail.com",
        })
      );
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());


  it("Testing axios post call success", async () => {
    render(<BookingComponent />);
    let serviceName = screen.getByTestId("serviceName");
    fireEvent.change(serviceName, { target: { value: "Denting and Painting" } });

    let emailId = screen.getByTestId("emailId");
    fireEvent.change(emailId, { target: { value: "Anita@gmail.com" } });

    let bookedOn = screen.getByTestId("bookedOn");
    fireEvent.change(bookedOn, { target: { value: "2025-10-14" } });

    let form = screen.getByTestId("newbooking-form");
    fireEvent.submit(form);
    let successMessage = await screen.findByTestId("success");
    expect(successMessage.innerHTML).toContain("1005");
  });


  it("Testing axios post call error", async () => {
    server.use(
      rest.post("http://localhost:4000/bookings", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<BookingComponent />);
    let serviceName = screen.getByTestId("serviceName");
    fireEvent.change(serviceName, { target: { value: "Denting and Painting" } });

    let emailld = screen.getByTestId("emailId");
    fireEvent.change(emailId, { target: { value: "Anita@gmail.com" } });

    let bookedon = screen.getByTestId("booked0n");
    fireEvent.change(bookedon, { target: { value: "2025-10-14" } });

    let form = screen.getByTestId("newbooking-form");
    fireEvent.submit(form);

    let errorMessage = await screen.findByTestId("error");
    expect(errorMessage.innerHTML).toContain("Something went wrong");
  });
});

describe("Booking form validation", () => {
  it("Testing mandatory fields validation", () => {
    render(<BookingComponent />);
    let form = screen.getByTestId("newbooking-form");
    fireEvent.submit(form);
    let mandatory = screen.getByTestId("mandatory");
    expect(mandatory.innerHTML).toContain("Enter all the form fields");
  });
  it("Testing serviceName field validation", () => {
    render(<BookingComponent />);
    let input = screen.getByTestId("serviceName");
    fireEvent.change(input, { target: { value: "" } });
    let serviceNameError = screen.getByTestId("serviceName-Error");
    expect(serviceNameError.innerHTML).toContain("Please select Service name");
  });
  it("Testing emailid field validation", () => {
    render(<BookingComponent />);
    let input = screen.getByTestId("emailId");
    fireEvent.change(input, { target: { value: "John" } });
    let emailError = screen.getByTestId("email-error");
    expect(emailError.innerHTML).toContain("Please enter valid email");
  });
  it("Testing booked on field validation", () => {
    render(<BookingComponent />);
    let input = screen.getByTestId("bookedon");
    fireEvent.change(input, { target: { value: "2020-10-30" } });
    let bookingDateError = screen.getByTestId("bookingDate-error");
    expect(bookingDateError.innerHTML).toContain(
      `Booking date should be after today's date`);
  });
  it("Testing whether the button is disabled", () => {
    render(<BookingComponent />);
    let serviceName = screen.getByTestId("serviceName");
    fireEvent.change(serviceName, { target: { value: "John" } });
    let email = screen.getByTestId("emailId");
    fireEvent.change(email, { target: { value: "John" } });
    let bookedOnDate = screen.getByTestId("bookedon");
    fireEvent.change(bookedOnDate, { target: { value: "2020-10-30" } });
    let button = screen.getByTestId("button");
    expect(button).toBeDisabled();
  });
}
);

describe("Testing AllBooking component", () => {
  const server = setupServer(
    rest.get("http://localhost:4000/bookings", (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 1005,
            serviceName: "Denting and Painting",
            bookedOn: "2022-11-23",
            emailId: "Anita@gmail.com",
          },
        ])
      );
    })
  )

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("testing axios get call success", async () => {
    render(<AllBookings />)
    let input = await screen.findByTestId("bookingId")
    expect(input.innerHTML).toContain("1005")
  })

  it("Testing axios get call error", async () => {
    server.use(
      rest.get("http://localhost:4000/bookings/", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<AllBookings />);

    let errMsg = await screen.findByTestId("errMsg");
    expect(errMsg.innerHTML).toContain(
      "Get Data Failure"
    );
  })

  it("Testing axios delete call success", async () => {
    server.use(
      rest.delete("http://localhost:4000/bookings/:id",
        (req, res, ctx) => {
          const { id } = req.params;
          return res(ctx.status(200));
        }
      )
    );

    render(<AllBookings />);

    let deleteButton = await screen.findByTestId("delete-button");
    fireEvent.click(deleteButton);
    let successMsg = await screen.findByTestId("deleteSuccessMsg");
    expect(successMsg.innerHTML).toContain("1005");
  });

  it("Testing axios delete call error", async () => {
    server.use(
      rest.delete("http://localhost:4000/bookings/:id",
        (req, res, ctx) => {
          const { id } = req.params;
          return res(ctx.status(400));
        }
      )
    );

    render(<AllBookings />);
    let deleteButton = await screen.findByTestId("delete-button");
    fireEvent.click(deleteButton);
    let successMsg = await screen.findByTestId("deleteFailureMsg");
    expect(successMsg.innerHTML).toContain("Something went wrong, Booking not deleted")
  });

})