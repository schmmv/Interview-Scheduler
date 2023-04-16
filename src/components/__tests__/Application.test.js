import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, wait } from "@testing-library/react";

import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {

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

  xit("loads data, books an interview and reduces the spots remaining for the Monday by 1", async () => {
 
  const { container, debug } = render(<Application />);
  
  await waitForElement(() => getByText(container, 'Archie Cohen'));
  // console.log("After render in first test: \n", prettyDOM(container));

  const appointment = getAllByTestId(container, "appointment")[0];
  fireEvent.click(getByAltText(appointment, 'Add'));

  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Lydia Miller-Jones" } });

  fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
  fireEvent.click(getByText(appointment, 'Save'));

  expect(getByText(appointment, "Saving...")).toBeInTheDocument();
  //not working because of websocket..
  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

  const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

  expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  // console.log("end of add test: \n", prettyDOM(container));
  console.log("test 1 end");
  })

  xit("load data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
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
  // //8. wait for the blank element is displayed
  await waitForElement(() => getByAltText(appointment, "Add"));

  // //9. get monday
  const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
  // //10. check that monday has an extra spot remaining now
  expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  // console.log("end of add test: \n", prettyDOM(container));
  console.log("test 2 end");

  })

  xit("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
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
  await waitForElement(() => getByText(appointment, "Alice Wonderland"));
  expect(getByText(appointment, "Alice Wonderland")).toBeInTheDocument();
  // //9. get monday
  const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
  // //10. check that monday has same spots remaining
  expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })

  xit("shows the save error when failing to save and appointment", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, 'Archie Cohen'));
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, 'Archie Cohen'));
    
    //4. Click Edit
    fireEvent.click(getByAltText(appointment, 'Edit'));
    //5. Change name of student (or interviewer)
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Alice Wonderland" } });

    //6. 
    fireEvent.click(getByText(appointment, 'Save'));

    axios.put.mockRejectedValueOnce();
    
    await waitForElement(() => getByText(appointment, 'Error'));
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
    fireEvent.click(getByText(appointment, "Confirm"));

    axios.delete.mockRejectedValueOnce();
    await waitForElement(() => getByText(appointment, 'Error'));
    expect(getByText(appointment, 'Error')).toBeInTheDocument();
    
  })

});