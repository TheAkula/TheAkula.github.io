import MainCity from "../../containers/MainCity/MainCity";
import classes from "./MainCities.module.css";

const mainCities = (props) => {
  return (
    <div className={classes["main-cities"]}>
      {props.cities.map((data) => {
        return <MainCity key={data.id} data={data} />;
      })}
    </div>
  );
};

export default mainCities;
