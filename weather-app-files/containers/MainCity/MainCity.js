import { Navigate } from "react-router-dom";
import { useContext, useState } from "react";

import classes from "./MainCity.module.css";

import Thunderstorm from "../../assets/images/Thunderstorm.svg";
import Clear from "../../assets/images/Clear.svg";
import Clouds from "../../assets/images/Clouds.svg";
import Drizzle from "../../assets/images/Drizzle.svg";
import DustSandAsh from "../../assets/images/Dust - Sand - Ash.svg";
import MistSmokeHazeFog from "../../assets/images/Mist - Smoke - Haze -Fog.svg";
import Rain from "../../assets/images/Rain.svg";
import Snow from "../../assets/images/Snow.svg";
import Squall from "../../assets/images/Squall.svg";
import Tornado from "../../assets/images/Tornado.svg";

import { CityContext } from "../../context/city-context";
import axios from "axios";
import Spinner from "../../components/UI/Spinner/Spinner";

const MainCity = (props) => {
  const { cityDispatch } = useContext(CityContext);
  const [isSubmited, setIsSubmited] = useState(false);
  const [loading, setLoading] = useState(false);

  const onClickHandler = (e) => {
    setLoading(true);
    const target = e.target.closest("div");
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?id=${target.id}&units=metric&appid=b6e6aef7a39cccf20895cd82847b0da5&lang=ru`
      )
      .then((response) => {
        setLoading(false);
        cityDispatch({ type: "SET", data: response.data });
        setIsSubmited(true);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getImage = () => {
    let image;
    switch (props.data.weather[0].main.toLowerCase()) {
      case "clouds":
        image = Clouds;
        break;
      case "clear":
        image = Clear;
        break;
      case "drizzle":
        image = Drizzle;
        break;
      case "dust" || "sand" || "ash":
        image = DustSandAsh;
        break;
      case "mist" || "smoke" || "haze" || "fog":
        image = MistSmokeHazeFog;
        break;
      case "rain":
        image = Rain;
        break;
      case "snow":
        image = Snow;
        break;
      case "squall":
        image = Squall;
        break;
      case "thunderstorm":
        image = Thunderstorm;
        break;
      case "tornado":
        image = Tornado;
        break;
      default:
        return null;
    }
    return image;
  };

  let city = <Navigate to="/city" />;

  if (!isSubmited) {
    city = (
      <div
        id={props.data.id}
        onClick={onClickHandler}
        className={classes.MainCity}
      >
        {loading ? (
          <Spinner class={classes.MainCitySpinner} />
        ) : (
          <>
            <p className={classes.Name}>{props.data.name}</p>
            <p className={classes.Temp}>{Math.round(props.data.main.temp)}°</p>
            <img src={getImage()} alt={props.data.weather[0].main} />
          </>
        )}
      </div>
    );
  }

  return city;
};

export default MainCity;
