import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode, replace = false) {
    setMode(newMode);
    if (!replace) {
      setHistory([...history, newMode]);
    }
  }

  const back = function() {
    if (history.length > 1) {
      const copyHistory = [...history];
      copyHistory.pop();
      setHistory(copyHistory);
      setMode(copyHistory[copyHistory.length - 1]);
    }
  }

  return { mode, transition, back };
}