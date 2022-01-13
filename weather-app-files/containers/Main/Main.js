import { useCallback, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import axios from "axios";

import Input from "../Input/Input";
import Arrow from "../../assets/images/Arrow.svg";
import classes from "./Main.module.css";
import Vector from "../../assets/images/Vector.svg";
import Spinner from "../../components/UI/Spinner/Spinner";
import MainCities from "../../components/MainCities/MainCities";

import { CityContext } from "../../context/city-context";
import { AuthContext } from "../../context/auth-context";

const Main = () => {
  const [citiesToShow, setCitiesToShow] = useState([]);
  const [loading, setLoading] = useState(false);

  const { cityState, cityDispatch } = useContext(CityContext);
  const { authState } = useContext(AuthContext);

  const { userId } = authState;

  const autoHandler = () => {
    cityDispatch({ type: "SET_LOADING" });
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?id=${554840}&units=metric&appid=b6e6aef7a39cccf20895cd82847b0da5&lang=ru`
      )
      .then((response) => {
        cityDispatch({ type: "SET", data: response.data });
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
    axios
      .get(
        `https://weather-check-86134-default-rtdb.firebaseio.com/chosen/${userId}.json`
      )
      .then((response) => {
        const citiesS = [];
        for (let key in response.data) {
          citiesS.push(response.data[key].id);
        }
        showCities(citiesS);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [showCities, userId]);

  useEffect(() => {
    getChosen();
  }, [getChosen]);

  let main = (
    <div className={classes.Main}>
      {cityState.data && <Navigate to="/city" />}
      <Input />
      {citiesToShow.length ? (
        <MainCities cities={citiesToShow} />
      ) : loading ? (
        <Spinner class={classes.MainSpinner} />
      ) : (
        <>
          <p
            style={{
              margin: "43px auto 0 auto",
              position: "relative",
              width: "170px",
            }}
          >
            <img
              src={Arrow}
              alt=""
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                transform: "translate(calc(-100% - 5.91px), -50%)",
              }}
            />
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
          </p>
          <p style={{ width: "244px", margin: "88px auto 0 auto" }}>
            Используйте значок "закладки", чтобы закрепить город на главной
            <img src={Vector} alt="" style={{ marginTop: "23.33px" }} />
          </p>
        </>
      )}
    </div>
  );

  return main;
};

export default Main;
