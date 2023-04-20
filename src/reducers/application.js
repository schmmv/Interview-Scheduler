import { dayNumber } from "../helpers/selectors";

export default function reducer(state, action) {
  switch (action.type) {
    case "SET_DAY":
      return { ...state, day: action.value };

    case "SET_APPLICATION_DATA":
      return { ...state, ...action.value };

    case "SET_INTERVIEW":
      const appointment = {
        ...state.appointments[action.value.id],
        interview: action.value.interview ? action.value.interview : null,
      };

      //update appointments
      const appointments = {
        ...state.appointments,
        [action.value.id]: appointment,
      };

      const days = [...state.days];
      const day = {
        ...state.days[dayNumber(state.day)],
      };

      //Update spots remaining:
      // editing an existing interview - spots remain the same
      // adding an interview - spots decrease by 1
      // canceling an interview - spots increase by 1
      const existingInterview = state.appointments[action.value.id].interview;

      if (!existingInterview) {
        if (appointment.interview) {
          day.spots = state.days[dayNumber(state.day)].spots - 1;
        }
      } else {
        if (!appointment.interview) {
          day.spots = state.days[dayNumber(state.day)].spots + 1;
        }
      }

      //update days
      days[dayNumber(state.day)] = day;

      return { ...state, appointments, days };

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
