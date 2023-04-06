import { useReducer } from 'react';



const useDispatch = (initialData) => {

  function reducer(state, action) {
    switch (action.type) {
      case "SET_DAY":
        return { ...state, day: action.value };
      case "SET_APPLICATION_DATA":
        return { ...state, ...action.value };
      case "SET_INTERVIEW":
        return {...state, appointments: action.value.appointments, days: action.value.days };
      default:
        throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
    }
  }

  const [state, dispatch] = useReducer(reducer, initialData);

  return [state, dispatch];
}

export default useDispatch;
