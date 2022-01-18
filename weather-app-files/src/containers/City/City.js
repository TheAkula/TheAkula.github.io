import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";

// import Thunderstorm from "../../assets/images/Thunderstorm.svg";
// import Clear from "../../assets/images/Clear.svg";
// import Clouds from "../../assets/images/Clouds.svg";
// import Drizzle from "../../assets/images/Drizzle.svg";
// import DustSandAsh from "../../assets/images/Dust - Sand - Ash.svg";
// import MistSmokeHazeFog from "../../assets/images/Mist - Smoke - Haze -Fog.svg";
// import Rain from "../../assets/images/Rain.svg";
// import Snow from "../../assets/images/Snow.svg";
// import Squall from "../../assets/images/Squall.svg";
// import Tornado from "../../assets/images/Tornado.svg";

// import Vector1 from "../../assets/images/Vector (1).svg";
// import Vector from "../../assets/images/Vector.svg";
// import Coolicon from "../../assets/images/coolicon.svg";
// import Barometer from "../../assets/images/barometer 1.svg";
import classes from "./City.module.css";
import Spinner from "../../components/UI/Spinner/Spinner";

import { CityContext } from "../../context/city-context";
import { AuthContext } from "../../context/auth-context";

const City = () => {
  const { cityState, cityDispatch } = useContext(CityContext);
  const { authState } = useContext(AuthContext);

  const [chosen, setChosen] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userId } = authState;

  useEffect(() => {
    const url = `https://weather-check-86134-default-rtdb.firebaseio.com/chosen/${userId}.json?orderBy="id"&equalTo=${cityState.data.id}`;
    setLoading(true);
    axios
      .get(url)
      .then((response) => {
        let name;
        for (let i in response.data) {
          name = i;
          break;
        }

        setLoading(false);
        setChosen(name);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [cityState.data, userId]);

  const getImage = () => {
    let image;
    switch (cityState.data.weather[0].main.toLowerCase()) {
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

  const addToChosenHandler = () => {
    if (loading) return;
    const city = {
      id: cityState.data.id,
    };
    if (!chosen) {
      setLoading(true);
      axios
        .post(
          `https://weather-check-86134-default-rtdb.firebaseio.com/chosen/${authState.userId}.json`,
          city
        )
        .then((response) => {
          setLoading(false);
          let name;
          for (let i in response.data) {
            name = response.data[i];
            break;
          }
          setChosen(name);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      axios
        .delete(
          `https://weather-check-86134-default-rtdb.firebaseio.com/chosen/${authState.userId}/${chosen}.json`
        )
        .then((response) => {
          setLoading(false);
          setChosen(null);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  const onClickHandler = () => {
    cityDispatch({ type: "CLEAR" });
  };

  const getSun = () => {
    const sunrise = cityState.data.sys.sunrise * 1000;
    const sunset = cityState.data.sys.sunset * 1000;
    const now = new Date().getTime();
    let resultH;
    let resultM;
    let result;

    if (sunrise > now) {
      const date = new Date(sunrise);
      resultH = date.getHours();
      resultM = date.getMinutes();
      result = "Восход в ";
    }

    if (sunset > now) {
      const date = new Date(sunset);
      resultH = date.getHours();
      resultM = date.getMinutes();
      result = "Закат в ";
    }

    if (resultH < 10) {
      resultH = "0" + resultH;
    }

    if (resultM < 10) {
      resultM = "0" + resultM;
    }

    if (result) {
      return result + resultH + ":" + resultM;
    } else {
      return "Солнце уже зашло";
    }
  };

  const image = getImage();

  return (
    <div className={classes.City}>
      <Link onClick={onClickHandler} className={classes.Back} to="/">
        <div>
          <div className="svg-coolicon svg-coolicon-dims"></div>
        </div>
        <span>Назад</span>
      </Link>
      <div onClick={addToChosenHandler} className={classes.Choose}>
        <div
          className={
            chosen
              ? "svg-Vector1 svg-Vector1-dims"
              : "svg-Vector svg-Vector-dims"
          }
        ></div>
        {loading && <Spinner class={classes.CitySpinner} />}
      </div>
      <div className={classes.CityWeather}>
        <h1>{cityState.data.name}</h1>
        <p className={classes.Sky}>
          {cityState.data.weather[0].description[0].toUpperCase() +
            cityState.data.weather[0].description.slice(1)}
        </p>
        <div className={classes.TemperatureBlock}>
          <span>{Math.round(cityState.data.main.temp)}°</span>
          <div className={`svg-${image} svg-${image}-dims`}></div>
        </div>
        <div className={classes.PressureBlock}>
          <div className="svg-barometer_1 svg-barometer_1-dims"></div>
          <span id="pressure">{cityState.data.main.pressure} мм рт. ст.</span>
        </div>
        <p className={classes.SunsetBlock}>
          <span id="sunset">{getSun()}</span>
        </p>
      </div>
    </div>
  );
};

export default City;
