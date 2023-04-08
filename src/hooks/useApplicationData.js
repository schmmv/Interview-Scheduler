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

  const setDay = day => dispatch({ type: ACTION.SET_DAY, value: day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({ type: ACTION.SET_APPLICATION_DATA, value: { days: all[0].data, appointments: all[1].data, interviewers: all[2].data } });
    })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // WebSocket 
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.onopen = (event) => {
      socket.send("ping");

      socket.onmessage = event => {
        const msg = JSON.parse(event.data);
        console.log("Message Received From Server:", msg);
        if (msg.type === "SET_INTERVIEW") {
          console.log("dispatching set interview");
          dispatch({ type: ACTION.SET_INTERVIEW, value: { id: msg.id, interview: msg.interview }});
        }
      };
    };
    const cleanup = () => {
      socket.close();
    }
    return cleanup;
  }, []);

  function bookInterview(id, interview) {

    return axios.put(`/api/appointments/${id}`, {
      interview
    })
      .then(() => {
        dispatch({ type: ACTION.SET_INTERVIEW, value: { id, interview } });
      });
  }

  function cancelInterview(id) {

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: ACTION.SET_INTERVIEW, value: { id, interview: null } });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}