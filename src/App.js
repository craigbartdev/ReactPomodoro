import "./App.css";
import { Header } from "./components/Header";
import { Form } from "./components/Form";
import { useState } from "react";
import { Dashboard } from "./components/Dashboard";

function App() {
  const [formStatus, setFormStatus] = useState(true);
  const [header, setHeader] = useState("Work");
  const [[workTime, breakTime, rounds, currentRound], setTimer] = useState([
    25 * 60,
    5 * 60,
    4,
    1,
  ]);

  // takes in an array and sets the state
  const initTimer = (workT, breakT, roundsN) => {
    setTimer([workT, breakT, roundsN, 1]);
    setFormStatus(false);
    setHeader("Work");
  };

  return (
    <div>
      <Header formStatus={formStatus} header={header}/>
      {formStatus ? (
        <Form
          initTimer={initTimer}
          workTime={workTime}
          breakTime={breakTime}
          rounds={rounds}
        />
      ) : (
        <Dashboard
          workTime={workTime}
          breakTime={breakTime}
          rounds={rounds}
          currentRound={currentRound}
          setTimer={setTimer}
          setFormStatus={setFormStatus}
          setHeader={setHeader}
        />
      )}
    </div>
  );
}

export default App;
