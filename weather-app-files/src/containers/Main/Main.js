import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

import Input from "../Input/Input";
import classes from "./Main.module.css";
import Spinner from "../../components/UI/Spinner/Spinner";
import MainCities from "../../components/MainCities/MainCities";

import { CityContext } from "../../context/city-context";

const Main = () => {
  const [citiesToShow, setCitiesToShow] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { cityDispatch } = useContext(CityContext);

  useEffect(() => {
    document.body.style.background = "#161b30";
    cityDispatch({ type: "REMOVE_CITY" });
  }, [cityDispatch]);

  const autoHandler = () => {
    cityDispatch({ type: "SET_LOADING" });
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?id=${554840}&units=metric&appid=b6e6aef7a39cccf20895cd82847b0da5&lang=ru`
      )
      .then((response) => {
        cityDispatch({ type: "SET", data: response.data });
        navigate("city");
      })
      .catch((err) => {
        cityDispatch({ type: "SET", data: null });
      });
  };

  const showCities = useCallback(async (cities) => {
    const citiesS = [];
    for (let id of cities) {
      await axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?id=${id}&units=metric&appid=b6e6aef7a39cccf20895cd82847b0da5&lang=ru`
        )
        .then((response) => {
          citiesS.push(response.data);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
    setLoading(false);
    setCitiesToShow((prevCities) => citiesS);
  }, []);

  const getChosen = useCallback(() => {
    setLoading(true);
    const chosenCities = window.localStorage.getItem("chosenCities");
    if (!chosenCities) {
      setLoading(false);
      return;
    }
    const arrOfChosenCities = JSON.parse(chosenCities);
    showCities(arrOfChosenCities);
  }, [showCities]);

  useEffect(() => {
    getChosen();
  }, [getChosen, cityDispatch]);

  return (
    <div className={classes.main}>
      <Input />
      {citiesToShow.length ? (
        <MainCities cities={citiesToShow} />
      ) : loading ? (
        <Spinner class={classes.spinner_main} />
      ) : (
        <>
          <div
            style={{
              margin: "43px auto 0 auto",
              position: "relative",
              width: "170px",
            }}
          >
            <div
              className="svg-Arrow svg-Arrow-dims"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: "translate(calc(-100% - 5.91px), -50%)",
              }}
            ></div>
            Начните вводить город, например,{" "}
            <span
              style={{
                color: "#fff",
                borderBottom: "1px dashed #fff",
                cursor: "pointer",
              }}
              onClick={autoHandler}
            >
              Ижевск
            </span>
          </div>
          <div style={{ width: "244px", margin: "88px auto 0 auto" }}>
            Используйте значок "закладки", чтобы закрепить город на главной
            <div
              className="svg-Vector svg-Vector-dims"
              style={{ margin: "0 auto", marginTop: "23.33px" }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default Main;
