import { useEffect, useReducer } from "react";
import axios from 'axios';
import { ACTION } from '../constants';
import reducer from "../helpers/reducer";




export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  // const dayNumber = (day) => {
  //   return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].findIndex(x => x === day);
  // };

  const setDay = day => dispatch({ type: ACTION.SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({ type: ACTION.SET_APPLICATION_DATA, value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data} });
      // setState((prev) => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
    .catch((error) => {
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log(error.response.data);
    });
  }, []);

  //WebSocket 
  // useEffect(() => {
  //   const socket = new WebSocket('ws://localhost:8001');
  //   socket.onopen = (event) => {
  //     socket.send("Sending text from client to server");
  //   };
  //   const cleanup = () => {
  //     socket.close();
  //   }
    
  // }, []);

 

  function bookInterview(id, interview) {

    // const appointment = {
    //   ...state.appointments[id],
    //   interview: { ...interview }
    // };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };

    // const day = {
    //   ...state.days[dayNumber(state.day)],
    //   spots: state.days[dayNumber(state.day)].spots - 1
    // };
    // const days = state.days;
    // days[dayNumber(state.day)] = day;

   return axios.put(`/api/appointments/${id}`, {
        interview
      })
      .then(() => {
        // setState({ 
        //   ...state,
        //   appointments,
        //   days
        // });
        dispatch({ type: ACTION.SET_INTERVIEW, value: { id, interview }});
      });
  }

  function cancelInterview(id) {
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: null
    // };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };

    // const day = {
    //   ...state.days[dayNumber(state.day)],
    //   spots: state.days[dayNumber(state.day)].spots + 1
    // };

    // const days = state.days;
    // days[dayNumber(state.day)] = day;
   return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      // setState({
      //   ...state,
      //   appointments,
      //   days
      // });
      dispatch({ type: ACTION.SET_INTERVIEW, value: { id, interview: null }});
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}