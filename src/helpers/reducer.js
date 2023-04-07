
import { dayNumber } from "./selectors";

 export default function reducer(state, action) {
    switch (action.type) {

      case "SET_DAY":
        return { ...state, day: action.value };

      case "SET_APPLICATION_DATA":

        return { ...state, ...action.value };

      case "SET_INTERVIEW":

        const appointment = {
          ...state.appointments[action.value.id],
          interview: action.value.interview ? {...action.value.interview } : null
        };
      
        const appointments = {
          ...state.appointments,
          [action.value.id]: appointment,
        }

        const spots = state.days[dayNumber(state.day)].spots;

        const day = {
          ...state.days[dayNumber(state.day)],
          spots: appointment.interview ? spots - 1 : spots + 1
        };

        const days = state.days;
        days[dayNumber(state.day)] = day;

        return {...state, appointments, days };
      default:
        throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
    }
  }


