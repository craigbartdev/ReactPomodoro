// import classes from "./Header.module.css";

export const Header = (props) => {
  return <div>{props.form ? <h1>Get Started</h1> : <h1>Pomodoro</h1>}</div>;
};
