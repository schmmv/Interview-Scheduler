export function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.find(elem => elem.name === day);
  
  const appointmentsArr = filteredDay ? filteredDay.appointments : [];

  const matchingAppointments = [];

  appointmentsArr.forEach((appt) => {
    matchingAppointments.push(state.appointments[appt]);
  });
  
  return matchingAppointments;
}

export function getInterview(state, interview) {
/* "3": {
  id: 3,
  time: "2pm",
  interview: { student: "Archie Cohen", interviewer: 2 }
}*/
if (!interview) {
  return null;
}
const interviewerInfo = state.interviewers[interview.interviewer];

return { 
  student: interview.student,
  interviewer: interviewerInfo
};

}