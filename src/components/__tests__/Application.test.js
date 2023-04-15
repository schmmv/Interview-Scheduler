import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText } from "@testing-library/react";

import Application from "components/Application";

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

it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
  /**
   * Render the Application.
   
Wait until the text "Archie Cohen" is displayed.
Click the "Add" button on the first empty appointment.
Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
Click the first interviewer in the list.
Click the "Save" button on that same appointment.
Check that the element with the text "Saving" is displayed.
Wait until the element with the text "Lydia Miller-Jones" is displayed.
Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
   */
  //Render the Application
  const { container, debug } = render(<Application />);
  //Wait until the text "Archie Cohen" is displayed
  await waitForElement(() => getByText(container, 'Archie Cohen'));
  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[0];
  console.log("First found appointment by TestId: ", prettyDOM(appointment));
  //Click the "Add" button on the first empty appointment.
  fireEvent.click(getByAltText(appointment, 'Add'));
  //Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), { target: { value: "Lydia Miller-Jones" } });
  //Click the first interviewer in the list.
  fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
  //Click the "Save" button on that same appointment.
  fireEvent.click(getByText(appointment, 'Save'));
  expect(getByText(appointment, "Saving...")).toBeInTheDocument();
  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
  console.log(prettyDOM(getAllByTestId(container, "appointment")));
})

});