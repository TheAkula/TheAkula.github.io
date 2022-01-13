import classes from "./ListElement.module.css";

const listElement = (props) => {
  const getName = () => {
    const same = props.inputValue;
    const other1 = props.name.slice(0, props.name.indexOf(same));
    const other2 = props.name.slice(props.name.indexOf(same) + same.length)
    return (
      <>
        {other1}
        <span style={{ color: "#fff" }}>{same}</span>
        {other2}
      </>
    );
  };

  return (
    <div
      id={props.name}
      onClick={props.clickedHandler}
      className={classes.ListElement}
    >
      {getName()}
    </div>
  );
};

export default listElement;
