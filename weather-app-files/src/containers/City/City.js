import { Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";

import classes from "./City.module.css";

import { CityContext } from "../../context/city-context";
import Spinner from "../../components/UI/Spinner/Spinner";

const City = () => {
  const { cityState, cityDispatch } = useContext(CityContext);

  const [chosen, setChosen] = useState(false);

  useEffect(() => {
    const chosenCities = window.localStorage.getItem("chosenCities");
    if (!chosenCities) {
      return;
    }
    const arrOfChosenCities = JSON.parse(chosenCities);
    setChosen(arrOfChosenCities.includes(cityState.data.id));
  }, [cityState.data]);

  useEffect(() => {
    document.body.style.background = `radial-gradient(
      80.36% 80.36% at 50% 0%,
      #5a607c 0%,
      #161b30 100%
    ) no-repeat`;
    cityDispatch({ type: "SET_CITY" });
  }, [cityDispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      cityDispatch({ type: "SET_LOADING" });
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?id=${cityState.data.id}&units=metric&appid=b6e6aef7a39cccf20895cd82847b0da5&lang=ru`
        )
        .then((response) => {
          cityDispatch({ type: "SET", data: response.data });
        })
        .catch((err) => {
          cityDispatch({ type: "SET", data: null });
        });
    }, 1000 * 60 * 60);
    return () => {
      clearInterval(timer);
    };
  }, [cityDispatch, cityState]);

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
    if (!chosen) {
      const chosenCities = window.localStorage.getItem("chosenCities");
      if (!chosenCities) {
        setChosen(true);
        window.localStorage.setItem(
          "chosenCities",
          JSON.stringify([cityState.data.id])
        );
        return;
      }
      const arrOfChosenCities = JSON.parse(chosenCities);
      window.localStorage.setItem(
        "chosenCities",
        JSON.stringify(arrOfChosenCities.concat(cityState.data.id))
      );
      setChosen(true);
    } else {
      const chosenCities = window.localStorage.getItem("chosenCities");
      if (!chosenCities) {
        return;
      }
      const arrOfChosenCities = JSON.parse(chosenCities);
      window.localStorage.setItem(
        "chosenCities",
        JSON.stringify(
          arrOfChosenCities.filter((id) => id !== cityState.data.id)
        )
      );
      setChosen(false);
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

  const city = (
    <>
      <Link
        onClick={onClickHandler}
        className={classes["city__button-back"]}
        to="/"
      >
        <div>
          <div className="svg-coolicon svg-coolicon-dims"></div>
        </div>
        <span>Назад</span>
      </Link>
      <div
        onClick={addToChosenHandler}
        className={classes["city__button-choose"]}
      >
        <div
          className={
            chosen
              ? "svg-Vector1 svg-Vector1-dims"
              : "svg-Vector svg-Vector-dims"
          }
        ></div>
      </div>
      {cityState.loading ? (
        <Spinner class={classes.spinner_city} />
      ) : (
        <div className={classes["city-weather"]}>
          <h1>{cityState.data.name}</h1>
          <p className={classes["city-weather__p-sky"]}>
            {cityState.data.weather[0].description[0].toUpperCase() +
              cityState.data.weather[0].description.slice(1)}
          </p>
          <div className={classes["block-temperature"]}>
            <span>{Math.round(cityState.data.main.temp)}°</span>
            <div className={classes["svg-container"]}>
              <div className={`svg-${image} svg-${image}-dims`}></div>
            </div>
          </div>
          <div className={classes["block-pressure"]}>
            <div className="svg-barometer_1 svg-barometer_1-dims"></div>
            <span id="pressure">{cityState.data.main.pressure} мм рт. ст.</span>
          </div>
          <p>
            <span id="sunset">{getSun()}</span>
          </p>
        </div>
      )}
    </>
  );

  return <div className={classes.city}>{city}</div>;
};

export default City;
