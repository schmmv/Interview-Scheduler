export function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.find(elem => elem.name === day);
  
  const appointmentsArr = filteredDay ? filteredDay.appointments : [];

  const matchingAppointments = [];

  appointmentsArr.forEach((appt) => {
    matchingAppointments.push(state.appointments[appt]);
  });
  
  return matchingAppointments;
}