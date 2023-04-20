/**
 * Retrieves more detailed appointment information for each appointment id listed for a particular day
 * @param {obj} state
 * @param {string} day
 * @returns Array of appointments for the given day
 */
export function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.find((elem) => elem.name === day);

  //Day's array of appointment id's
  const appointmentsArr = filteredDay ? filteredDay.appointments : [];

  const matchingAppointments = [];

  //Detailed appointments for each appointment id
  appointmentsArr.forEach((appt) => {
    matchingAppointments.push(state.appointments[appt]);
  });

  return matchingAppointments;
}

/**
 * Retrieve more detailed interviewer information for an interview's interviewer id
 * @param {obj} state
 * @param {obj} interview
 * @returns interview object with detailed interviewer information
 */
export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  const interviewerInfo = state.interviewers[interview.interviewer];

  return {
    student: interview.student,
    interviewer: interviewerInfo,
  };
}

/**
 * Retrieves interviewer details for a particular day
 * @param {obj} state
 * @param {string} day
 * @returns Array of interviewers for the given day
 */
export function getInterviewersForDay(state, day) {
  const filteredDay = state.days.find((elem) => elem.name === day);

  const interviewersArr = filteredDay ? filteredDay.interviewers : [];

  const matchingInterviewers = [];

  interviewersArr.forEach((int) => {
    matchingInterviewers.push(state.interviewers[int]);
  });

  return matchingInterviewers;
}

/**
 * Transform day string into number representing that day
 * @param {string} day
 * @returns index of array where day is found
 */
export function dayNumber(day) {
  return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].findIndex(
    (x) => x === day
  );
}
