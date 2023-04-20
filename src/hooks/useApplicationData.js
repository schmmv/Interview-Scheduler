import { useEffect, useReducer } from "react";
import axios from "axios";
import { ACTION } from "../constants";
import reducer from "../reducers/application";

/**
 * Custom Hook for loading initial data and dispatching actions to update state
 */
export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  //set day that is clicked on
  const setDay = (day) => dispatch({ type: ACTION.SET_DAY, value: day });

  //get data upon render and set state to that data
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ])
      .then((all) => {
        dispatch({
          type: ACTION.SET_APPLICATION_DATA,
          value: {
            days: all[0].data,
            appointments: all[1].data,
            interviewers: all[2].data,
          },
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //WebSocket for persistent connection to scheduler API server
  //Real-time updates between multiple users
  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.onopen = (event) => {
      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "SET_INTERVIEW") {
          dispatch({
            type: ACTION.SET_INTERVIEW,
            value: { id: msg.id, interview: msg.interview },
          });
        }
      };
    };
    const cleanup = () => {
      socket.close();
    };
    return cleanup;
  }, []);

  /**
   * Add an interview (object) based on appointment slot id
   * @returns axios put request promise
   */
  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, {
      interview,
    });
  }
  /**
   * Delete an interview based on appointment slot id
   * @returns axios delete request promise
   */
  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`);
  }

  return { state, setDay, bookInterview, cancelInterview };
}
