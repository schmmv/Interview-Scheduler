import React from "react";
import classNames from "classnames";
import "components/InterviewerListItem.scss";

//Individual Interviewer Icon
export default function InterviewerListItem(props) {
  const intClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });
  return (
    <li onClick={props.setInterviewer} className={intClass}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
}
