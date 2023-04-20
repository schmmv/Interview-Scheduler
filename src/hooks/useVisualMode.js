import { useState } from "react";
/**
 * Custom Hook to keep track of appointment component mode and transition between them
 */
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  //Transition to a different mode
  const transition = function (newMode, replace = false) {
    setMode(newMode);
    if (!replace) {
      setHistory([...history, newMode]);
    }
  };
  //Return to previous mode
  const back = function () {
    if (history.length > 1) {
      const copyHistory = [...history];
      copyHistory.pop();
      setHistory(copyHistory);
      setMode(copyHistory[copyHistory.length - 1]);
    }
  };

  return { mode, transition, back };
}
