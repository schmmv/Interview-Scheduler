import React from "react";
import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
} from "@testing-library/react";
import Application from "components/Application";
import axios from "axios";
import WS from "jest-websocket-mock";

afterEach(cleanup);

describe("Application", () => {
  //TO MOCK WEBSOCKETS: set up mock server and client and reset between tests
  let server;
  let client;

  beforeEach(async () => {
    server = new WS(process.env.REACT_APP_WEBSOCKET_URL);
    client = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    await server.connected;
  });

  afterEach(() => {
    server.close();
    WS.clean();
  });

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    //Mock WebSocket - self-imposed STRETCH
    let message = null;
    client.onmessage = (e) => {
      message = e.data;
    };
    //send update to websocket
    const newBooking = {
      type: "SET_INTERVIEW",
      id: 1,
      interview: { student: "Lydia Miller-Jones", interviewer: 1 },
    };
    server.send(JSON.stringify(newBooking));
    //check that message received by client
    expect(message).toEqual(JSON.stringify(newBooking));

    //confirm new data is rendered
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("load data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(
      getByText(appointment, "Are you sure you would like to delete?")
    ).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    //Mock WebSocket - self-imposed STRETCH
    let message = null;
    client.onmessage = (e) => {
      message = e.data;
    };
    //send update to websocket
    const noBooking = {
      type: "SET_INTERVIEW",
      id: 2,
      interview: null,
    };
    server.send(JSON.stringify(noBooking));
    //check that message received by client
    expect(message).toEqual(JSON.stringify(noBooking));

    //confirm deleted data is rendered (empty appointment)
    await waitForElement(() => getByAltText(appointment, "Add"));
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Alice Wonderland" },
    });

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    //Mock WebSocket - self-imposed STRETCH
    let message = null;
    client.onmessage = (e) => {
      message = e.data;
    };
    //send update to websocket
    const updatedBooking = {
      type: "SET_INTERVIEW",
      id: 2,
      interview: { student: "Alice Wonderland", interviewer: 1 },
    };
    server.send(JSON.stringify(updatedBooking));
    //check that message received by client
    expect(message).toEqual(JSON.stringify(updatedBooking));

    //confirm edited data is rendered
    await waitForElement(() => getByText(appointment, "Alice Wonderland"));
    expect(getByText(appointment, "Alice Wonderland")).toBeInTheDocument();
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Alice Wonderland" },
    });

    axios.put.mockRejectedValueOnce('Deliberate mockRejectedValue Error');

    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(appointment, "Error"));

    expect(getByText(appointment, "Error")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    axios.delete.mockRejectedValueOnce('Deliberate mockRejectedValue Error');

    fireEvent.click(getByText(appointment, "Confirm"));

    await waitForElement(() => getByText(appointment, "Error"));

    expect(getByText(appointment, "Error")).toBeInTheDocument();
  });
});
