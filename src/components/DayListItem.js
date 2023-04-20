import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

//Individual Day Component
export default function DayListItem(props) {
  function formatSpots(numOfSpots) {
    if (numOfSpots === 0) {
      return "no spots remaining";
    } else if (numOfSpots === 1) {
      return "1 spot remaining";
    } else {
      return `${numOfSpots} spots remaining`;
    }
  }

  let dayClass = classNames(
    "day-list__item",
    { "day-list__item--selected": props.selected },
    { "day-list__item--full": props.spots === 0 }
  );

  return (
    <li
      data-testid="day"
      onClick={() => props.setDay(props.name)}
      className={dayClass}
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
