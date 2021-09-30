import { useRef } from "react";

export const Form = (props) => {
  const workTimeRef = useRef();
  const breakTimeRef = useRef();
  const roundsRef = useRef();

  const toggleFormHandler = (e) => {
    e.preventDefault();

    const workTime = workTimeRef.current.value * 60;
    const breakTime = breakTimeRef.current.value * 60;
    const rounds = roundsRef.current.value;

    props.initTimer(workTime, breakTime, rounds);
  };

  return (
    <form onSubmit={toggleFormHandler}>
      <div>
        <label htmlFor="workTime">Work Time: </label>
        <input
          required
          type="number"
          id="workTime"
          name="workTime"
          defaultValue={(props.workTime / 60).toString()}
          step="5"
          min="10"
          max="55"
          ref={workTimeRef}
        />
      </div>
      <div>
        <label htmlFor="breakTime">Break Time: </label>
        <input
          required
          type="number"
          id="breakTime"
          name="breakTime"
          defaultValue={(props.breakTime / 60).toString()}
          step="1"
          min="1"
          max="15"
          ref={breakTimeRef}
        />
      </div>
      <div>
        <label htmlFor="rounds">Rounds: </label>
        <input
          required
          type="number"
          id="breakTime"
          name="breakTime"
          defaultValue={props.rounds.toString()}
          step="1"
          min="1"
          max="10"
          ref={roundsRef}
        />
      </div>
      <div>
        <button>Start</button>
      </div>
    </form>
  );
};
