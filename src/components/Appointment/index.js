import React, { useEffect } from 'react';
import 'components/Appointment/styles.scss';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import useVisualMode from 'hooks/useVisualMode';
import Form from './Form';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";


export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch((err) => {
      console.log(err.response);
      return transition(ERROR_SAVE, true);
    });
  }

  function deleteAppointment(id) {
    if (mode !== CONFIRM) {
      transition(CONFIRM);
    } else {
      transition(DELETING, true);
      props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((err) => {
        console.log(err.response);
        return transition(ERROR_DELETE, true);
      });
    }
  }

  function edit(id) {
    transition(EDIT);
  }

  useEffect(() => {
    if (mode === EMPTY && props.interview) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [props.interview, transition]);

  return (
    <article className='appointment'>
      <Header time={props.time} />
      {mode === SHOW && props.interview && (
        <Show 
          onDelete={deleteAppointment}
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={edit}
        />)}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE &&
        <Form 
          onSave={save}
          interviewers={props.interviewers}
          onCancel={back}
        />}
      {mode === SAVING && <Status message="Saving..." />}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === CONFIRM && <Confirm message="Are you sure you would like to delete?" onCancel={back} onConfirm={deleteAppointment} />}
      {mode === EDIT && 
        <Form 
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />}
        {mode === ERROR_DELETE && <Error message="Could not cancel appointment" onClose={back} />}
        {mode === ERROR_SAVE && <Error message="Could not save appointment" onClose={back} />}
    </article>
  );
}