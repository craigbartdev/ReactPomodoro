import { useEffect, useState, useRef } from "react";
// import classes from "./Dashboard.module.css";

export const Dashboard = (props) => {
  const [pauseStatus, setPauseStatus] = useState(false);
  const [breakStatus, setBreakStatus] = useState(false);
  const [finishedStatus, setFinishedStatus] = useState(false);

  // useRef gives us the initial value of props before updating state
  const initWorkTimeRef = useRef(props.workTime);
  const initBreakTimeRef = useRef(props.breakTime);
  const initWorkTime = initWorkTimeRef.current;
  const initBreakTime = initBreakTimeRef.current;
  const displayWorkTime = new Date(props.workTime * 1000)
    .toISOString()
    .substr(14, 5);
  const displayBreakTime = new Date(props.breakTime * 1000)
    .toISOString()
    .substr(14, 5);

  const togglePause = () => {
    if (pauseStatus) {
      setPauseStatus(false);
    } else {
      setPauseStatus(true);
    }
  };

  const resetTime = () => {
    props.setTimer([
      initWorkTime,
      initBreakTime,
      props.rounds,
      props.currentRound,
    ]);
  };

  const nextTime = () => {
    if (!breakStatus) {
      if (props.currentRound < props.rounds) {
        setBreakStatus(true);
      } else {
        props.setTimer([initWorkTime, initBreakTime, props.rounds, 1]);
        setFinishedStatus(true);
      }
    } else {
      props.setTimer([
        initWorkTime,
        initBreakTime,
        props.rounds,
        props.currentRound + 1,
      ]);
      setBreakStatus(false);
    }
  };

  const exitTimer = () => {
    props.setTimer([initWorkTime, initBreakTime, props.rounds, 1]);
    props.setFormStatus(true);
  };

  // logic for incrementing the timer and rounds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!pauseStatus) {
        // last round case
        if (props.currentRound >= props.rounds) {
          // do not go to break on final round
          if (breakStatus || props.workTime <= 0) {
            props.setTimer([initWorkTime, initBreakTime, props.rounds, 1]);
            setFinishedStatus(true);
          } else {
            props.setTimer([
              props.workTime - 1,
              props.breakTime,
              props.rounds,
              props.currentRound,
            ]);
          }
        } else {
          // not last round case
          if (!breakStatus) {
            if (props.workTime <= 0) {
              setBreakStatus(true);
              props.setTimer([
                initWorkTime,
                initBreakTime,
                props.rounds,
                props.currentRound,
              ]);
            } else {
              props.setTimer([
                props.workTime - 1,
                props.breakTime,
                props.rounds,
                props.currentRound,
              ]);
            }
          } else {
            if (props.breakTime <= 0) {
              setBreakStatus(false);
              props.setTimer([
                initWorkTime,
                initBreakTime,
                props.rounds,
                props.currentRound + 1,
              ]);
            } else {
              props.setTimer([
                props.workTime,
                props.breakTime - 1,
                props.rounds,
                props.currentRound,
              ]);
            }
          }
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [props, breakStatus, initWorkTime, initBreakTime, pauseStatus]);

  return (
    <section>
      {finishedStatus ? (
        <div>
          <h1>Session Finished</h1>
          <button onClick={exitTimer}>Home</button>
        </div>
      ) : (
        <div>
          <h2>{breakStatus ? "Break" : "Work"}</h2>
          <h3>
            Work Time: {initWorkTime / 60} minutes <br />
            Break Time: {initBreakTime / 60} minutes <br />
            Rounds: {props.currentRound}/{props.rounds}
          </h3>
          <h1>{breakStatus ? displayBreakTime : displayWorkTime}</h1>
          <button onClick={resetTime}>Reset</button>
          <button onClick={togglePause}>
            {pauseStatus ? "Start" : "Pause"}
          </button>
          <button onClick={nextTime}>Next</button>
          <button onClick={exitTimer}>Exit</button>
        </div>
      )}
    </section>
  );
};
