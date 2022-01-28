import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import classes from "./MainCity.module.css";

import { CityContext } from "../../context/city-context";
import axios from "axios";

const MainCity = (props) => {
  const { cityDispatch } = useContext(CityContext);
  const navigate = useNavigate();

  const onClickHandler = (e) => {
    cityDispatch({ type: "SET_LOADING" });
    const target = e.target.closest("." + classes["main-city"]);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?id=${target.id}&units=metric&appid=b6e6aef7a39cccf20895cd82847b0da5&lang=ru`
      )
      .then((response) => {
        cityDispatch({ type: "SET", data: response.data });
        navigate("city");
      })
      .catch((err) => {});
  };

  const getImage = () => {
    let image;
    switch (props.data.weather[0].main.toLowerCase()) {
      case "clouds":
        image = "Clouds";
        break;
      case "clear":
        image = "Clear";
        break;
      case "drizzle":
        image = "Drizzle";
        break;
      case "dust" || "sand" || "ash":
        image = "Dust_-_Sand_-_Ash";
        break;
      case "mist" || "smoke" || "haze" || "fog":
        image = "Mist_-_Smoke_-_Haze_-_Fog";
        break;
      case "rain":
        image = "Rain";
        break;
      case "snow":
        image = "Snow";
        break;
      case "squall":
        image = "Squall";
        break;
      case "thunderstorm":
        image = "Thunderstorm";
        break;
      case "tornado":
        image = "Tornado";
        break;
      default:
        return "";
    }
    return image;
  };

  const image = getImage();

  return (
    <div
      id={props.data.id}
      onClick={onClickHandler}
      className={classes["main-city"]}
    >
      <p className={classes["main-city__p-name"]}>{props.data.name}</p>
      <p className={classes["main-city__p-temp"]}>
        {Math.round(props.data.main.temp)}°
      </p>

      <div className={`svg-${image} svg-${image}-dims `}></div>
    </div>
  );
};

export default MainCity;
