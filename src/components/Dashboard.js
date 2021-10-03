import { useEffect, useState, useRef } from "react";
import notiSound from "../assets/notification.mp3";
import doneSound from "../assets/finished.mp3";

export const Dashboard = (props) => {
  const [pauseStatus, setPauseStatus] = useState(false);
  const [breakStatus, setBreakStatus] = useState(false);
  const [finishedStatus, setFinishedStatus] = useState(false);

  // useRef gives us the initial value of props before updating state
  const initWorkTimeRef = useRef(props.workTime);
  const initBreakTimeRef = useRef(props.breakTime);
  const initWorkTime = initWorkTimeRef.current;
  const initBreakTime = initBreakTimeRef.current;
  // format times in minute format
  const displayWorkTime = new Date(props.workTime * 1000)
    .toISOString()
    .substr(14, 5);
  const displayBreakTime = new Date(props.breakTime * 1000)
    .toISOString()
    .substr(14, 5);

  // set browser title and header depending on state
  if (finishedStatus) {
      document.title = "Done";
      props.setHeader("Done");
  } else {
      if (breakStatus) {
        document.title = (displayBreakTime + " Break");
        props.setHeader("Break");
      } else {
        document.title = (displayWorkTime + " Work");
        props.setHeader("Work");
      }
  }

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

  const playAudio = (file) => {
    const audio = new Audio(file);
    audio.play();
  };

  // logic for incrementing the timer and rounds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!pauseStatus && !finishedStatus) {
        // last round case
        if (props.currentRound >= props.rounds) {
          // final round skips break
          if (props.workTime <= 0) {
            props.setTimer([initWorkTime, initBreakTime, props.rounds, 1]);
            setFinishedStatus(true);
            playAudio(doneSound);
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
              playAudio(notiSound);
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
              playAudio(notiSound);
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
  }, [props, breakStatus, initWorkTime, initBreakTime, pauseStatus, finishedStatus]);

  return (
    <section>
      {finishedStatus ? (
        <div>
          <button onClick={exitTimer}>Home</button>
        </div>
      ) : (
        <div>
          <h1>{breakStatus ? displayBreakTime : displayWorkTime}</h1>
          <button onClick={resetTime}>Reset</button>
          <button onClick={togglePause}>
            {pauseStatus ? "Start" : "Pause"}
          </button>
          <button onClick={nextTime}>Next</button>
          <button onClick={exitTimer}>Exit</button>
          <h3>
            Work Time: {initWorkTime / 60} minutes <br />
            Break Time: {initBreakTime / 60} minutes <br />
            Rounds: {props.currentRound}/{props.rounds}
          </h3>
        </div>
      )}
    </section>
  );
};
