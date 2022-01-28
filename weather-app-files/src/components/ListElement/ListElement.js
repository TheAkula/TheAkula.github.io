import classes from "./ListElement.module.css";

const listElement = (props) => {
  const getName = () => {
    const same = props.inputValue;
    const startSymbols = props.name.slice(0, props.name.indexOf(same));
    const endSymbols = props.name.slice(props.name.indexOf(same) + same.length);
    return (
      <>
        {startSymbols}
        <span style={{ color: "#fff" }}>{same}</span>
        {endSymbols}
      </>
    );
  };

  return (
    <div
      id={props.name}
      onClick={props.clickedHandler}
      className={classes["datalist__city"]}
    >
      {getName()}
    </div>
  );
};

export default listElement;
