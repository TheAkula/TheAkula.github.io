import classes from "./Spinner.module.css";

const spinner = (props) => (
  <div className={[classes.spinner, props.class].join(" ")}></div>
);

export default spinner;
