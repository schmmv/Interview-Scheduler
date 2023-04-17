import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, wait } from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";
import WS from "jest-websocket-mock";

// create a WS instance, listening on port xxxx on localhost

// real clients can connect
// const client = new WebSocket("ws://localhost:1234");
// await server.connected; // wait for the server to have established the connection

afterEach(cleanup);

describe("Application", () => {
  
  let server;
  let client;
  
  beforeEach(() => {
    server = new WS(process.env.REACT_APP_WEBSOCKET_URL);
    client = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
  });

  afterEach(() => {
    server.close();
    WS.clean();
  });

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
  const { getByText } = render(<Application />);

  return waitForElement(() => getByText('Monday')).then(() => {
    fireEvent.click(getByText('Tuesday'));
    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });
  });

  /** async/await version 
it("changes the schedule when a new day is selected", async () => {
  const { getByText } = render(<Application />);

  await waitForElement(() => getByText("Monday"));

  fireEvent.click(getByText("Tuesday"));

  expect(getByText("Leopold Silvers")).toBeInTheDocument();
});
 */

  it("loads data, books an interview and reduces the spots remaining for the Monday by 1", async () => {
  await server.connected;
 
  const { container, debug } = render(<Application />);
  
  await waitForElement(() => getByText(container, 'Archie Cohen'));
  // console.log("After render in first test: \n", prettyDOM(container));

  const appointment = getAllByTestId(container, "appointment")[0];
  fireEvent.click(getByAltText(appointment, 'Add'));

  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Lydia Miller-Jones" } });

  fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

  fireEvent.click(getByText(appointment, 'Save'));

  expect(getByText(appointment, "Saving...")).toBeInTheDocument();

  //mock WebSocket
  server.send(JSON.stringify({
      type: "SET_INTERVIEW",
      id: 1,
      interview: {student: "Lydia Miller-Jones", interviewer:1}
  }));
 
  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

  const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

  expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  // console.log("end of add test: \n", prettyDOM(container));
  })

  it("load data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
  await server.connected;
    //1. render the application

  const { container, debug } = render(<Application />);
  //2. wait until the text archie cohen is displayed
  await waitForElement(() => getByText(container, 'Archie Cohen'));
  // console.log("After render in second test: \n", prettyDOM(container));

  //3. get the appointment with Archie Cohen in it
  const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, 'Archie Cohen'));

  //4. Click delete
  fireEvent.click(getByAltText(appointment, 'Delete'));
  // //5. check that confirmation message appears
  expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument()
  
  // //6. click confirm
  fireEvent.click(getByText(appointment, "Confirm"));
  
  // //7. check that the status says deleting
  expect(getByText(appointment, "Deleting...")).toBeInTheDocument();
   //mock WebSocket
   server.send(JSON.stringify({
    type: "SET_INTERVIEW",
    id: 2,
    interview: null
  }));

  // //8. wait for the blank element is displayed
  await waitForElement(() => getByAltText(appointment, "Add"));
  // //9. get monday
  const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
  // //10. check that monday has an extra spot remaining now
  expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  // console.log("end of add test: \n", prettyDOM(container));
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
  await server.connected;
    //1. render the application
  const { container, debug } = render(<Application />);

  //2. wait until the text archie cohen is displayed
  await waitForElement(() => getByText(container, 'Archie Cohen'));
  //3. get the appointment with ARchie cohen in it
  const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, 'Archie Cohen'));

  //4. Click Edit
  fireEvent.click(getByAltText(appointment, 'Edit'));
  //5. Change name of student (or interviewer)
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Alice Wonderland" } });

  //6. 
  fireEvent.click(getByText(appointment, 'Save'));

  expect(getByText(appointment, "Saving...")).toBeInTheDocument();

   //mock WebSocket
   server.send(JSON.stringify({
    type: "SET_INTERVIEW",
    id: 2,
    interview: {student: "Alice Wonderland", interviewer:1}
  }));

  await waitForElement(() => getByText(appointment, "Alice Wonderland"));
  expect(getByText(appointment, "Alice Wonderland")).toBeInTheDocument();
  // //9. get monday
  const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
  // //10. check that monday has same spots remaining
  expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, 'Archie Cohen'));
    
    //4. Click Edit
    fireEvent.click(getByAltText(appointment, 'Edit'));
    //5. Change name of student (or interviewer)
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Alice Wonderland" } });

    axios.put.mockRejectedValueOnce();
    //6. 
    fireEvent.click(getByText(appointment, 'Save'));
    
    await waitForElement(() => getByText(appointment, 'Error'));
    debug();
    expect(getByText(appointment, 'Error')).toBeInTheDocument();
  
  })

  it("shows the delete error when failing to delete an existing appointment", async () => {
    //1. render the application 
    const { container, debug } = render(<Application />);
    //2. wait until the text archie cohen is displayed
    await waitForElement(() => getByText(container, 'Archie Cohen'));

    //3. get the appointment with Archie Cohen in it
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, 'Archie Cohen'));

    //4. Click delete
    fireEvent.click(getByAltText(appointment, 'Delete'));

    axios.delete.mockRejectedValueOnce();
    fireEvent.click(getByText(appointment, "Confirm"));

    await waitForElement(() => getByText(appointment, 'Error'));
    expect(getByText(appointment, 'Error')).toBeInTheDocument();
    
  })

});