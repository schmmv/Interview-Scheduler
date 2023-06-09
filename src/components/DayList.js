import React from "react";
import DayListItem from "./DayListItem";

//All days
export default function DayList(props) {
  const mappedDays = props.days.map((day) => {
    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.value}
        setDay={props.onChange}
      />
    );
  });

  return <ul>{mappedDays}</ul>;
}
