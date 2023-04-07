



// const useDispatch = (initialData) => {
  const dayNumber = (day) => {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].findIndex(x => x === day);
  };

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

       console.log({...state, appointments, days });
        return {...state, appointments, days };
      default:
        throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
    }
  }

  // const [state, dispatch] = useReducer(reducer, initialData);

  // return [state, dispatch];
// }


