import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";

import classes from "./Input.module.css";
import { CityContext } from "../../context/city-context";
import ListElement from "../../components/ListElement/ListElement";
import Spinner from "../../components/UI/Spinner/Spinner";

const Input = () => {
  const [showList, setShowList] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [sameValue, setSameValue] = useState("");
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const { cityState, cityDispatch } = useContext(CityContext);

  const onChangeHandler = (e) => {
    const autoComplete = () => {
      setShowList(true);
      const result = [];
      const url =
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
      const token = "837d1462dc4ff5371f7fb3123a3105b168772d26";
      const query = e.target.value;

      const options = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({ query: query }),
      };

      fetch(url, options)
        .then((response) => response.json())
        .then((result) => {
          setSameValue(e.target.value);
          setList(
            Array.from(
              new Set(
                result["suggestions"]
                  .map((city) => {
                    return city.data.city;
                  })
                  .filter((city) => {
                    if (city) {
                      return city.includes(e.target.value);
                    } else {
                      return false;
                    }
                  })
              )
            )
          );
        })
        .catch((error) => console.log("error", error));
      return result;
    };
    const firstValue = e.target.value[0];
    let value = firstValue
      ? firstValue.toUpperCase() + e.target.value.slice(1)
      : e.target.value;
    setInputValue(value);
    if (e.target.value.length >= 3) {
      autoComplete();
    } else {
      setShowList(false);
      setList((prevList) => []);
    }
  };

  const clickedHandler = (e) => {
    cityDispatch({ type: "SET_LOADING" });
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${e.target.id}&units=metric&appid=b6e6aef7a39cccf20895cd82847b0da5&lang=ru`
      )
      .then((response) => {
        cityDispatch({ type: "SET", data: response.data });
        navigate("city");
      })
      .catch((err) => {
        cityDispatch({ type: "SET", data: null });
      });
  };

  return (
    <div className={classes.InputBlock}>
      <input
        autoComplete="off"
        value={inputValue}
        name="towns"
        id="inp"
        onChange={onChangeHandler}
        type="text"
        className={classes.Input}
        placeholder="Укажите город"
      />
      {cityState.loading && <Spinner class={classes.InputSpinner} />}
      {showList ? (
        <div className={classes.Datalist}>
          {list.map((elem) => {
            return (
              <ListElement
                key={elem}
                name={elem}
                clickedHandler={clickedHandler}
                inputValue={sameValue}
              ></ListElement>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Input;
