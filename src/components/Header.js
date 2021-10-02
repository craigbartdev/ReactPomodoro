export const Header = (props) => {
  return <div>{props.formStatus ? <h1>Get Started</h1> : <h1>{props.header}</h1>}</div>;
};
