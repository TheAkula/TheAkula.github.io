import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../../context/auth-context";

import classes from "./Auth.module.css";
import Spinner from "../../components/UI/Spinner/Spinner";

const Auth = () => {
  const [email, setEmail] = useState({
    value: "",
    valid: false,
    type: "email",
    touched: false,
  });
  const [password, setPassword] = useState({
    value: "",
    valid: false,
    type: "password",
    touched: false,
  });

  const [isSignIn, setIsSignIn] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const { authState, authDispatch } = useContext(AuthContext);

  useEffect(() => {
    emailRef.current.addEventListener("blur", onBlur);
    passwordRef.current.addEventListener("blur", onBlur);
  }, []);

  const onBlur = (e) => {
    if (e.target.type === "email") {
      setEmail((prevEmail) => {
        return {
          ...prevEmail,
          touched: true,
        };
      });
    } else if (e.target.type === "password") {
      setPassword((prevPassword) => {
        return {
          ...prevPassword,
          touched: true,
        };
      });
    }
  };

  const emailChangedHandler = (e) => {
    setEmail((prevEmail) => {
      const target = e.target;
      return {
        ...prevEmail,
        valid: checkValidity(prevEmail.type, target),
        value: target.value,
      };
    });
  };

  const passwordChangedHandler = (e) => {
    setPassword((prevPassword) => {
      const target = e.target;
      return {
        ...prevPassword,
        valid: checkValidity(prevPassword.type, target),
        value: target.value,
      };
    });
  };

  const checkValidity = (type, target) => {
    let valid = true;

    if (type === "email") {
      const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      valid = pattern.test(target.value) && valid;
    } else if (type === "password") {
      valid = target.value.length >= 7 && valid;
    }

    return valid;
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const user = {
      email: email.value,
      password: password.value,
      returnSecureToken: true,
    };

    authDispatch({ type: "SET_LOADING" });

    const url = !isSignIn
      ? "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
      : "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

    axios
      .post(url + "AIzaSyAVzoRmOsmjHLVT7r9jigfByDQyrZhcVU4", user)
      .then((response) => {
        const expTime = +response.data.expiresIn * 1000 + new Date().getTime();
        window.localStorage.setItem("expiresIn", expTime);
        window.localStorage.setItem("userId", response.data.localId);
        window.localStorage.setItem("token", response.data.idToken);
        authDispatch({
          type: "RESPONSE",
          userId: response.data.localId,
          token: response.data.idToken,
          expiresIn: response.data.expiresIn,
        });
      })
      .catch((err) => {
        authDispatch({ type: "CATCH", error: err });
      });
  };

  const valid = email.valid && password.valid;

  return (
    <div className={classes["block-auth"]}>
      <div className={classes.auth}>
        {authState.error && isSignIn ? (
          <span style={{ color: "#e62f2f", fontSize: "14px" }}>
            Неверный пароль или email
          </span>
        ) : authState.error && !isSignIn ? (
          <span style={{ color: "#e62f2f", fontSize: "14px" }}>
            Пользователь с таким email уже существует
          </span>
        ) : authState.loading ? (
          <Spinner class={classes.spinner_auth} />
        ) : null}
        <form onSubmit={onSubmitHandler}>
          <input
            className={[
              classes["auth__input"],
              !email.valid && email.touched && email.value
                ? classes["auth__input_invalid"]
                : "",
            ].join(" ")}
            ref={emailRef}
            type="email"
            onChange={emailChangedHandler}
            placeholder="Эл. почта"
            value={email.value}
          />
          <input
            className={[
              classes["auth__input"],
              !password.valid && password.touched && password.value
                ? classes["auth__input_invalid"]
                : "",
            ].join(" ")}
            ref={passwordRef}
            type="password"
            onChange={passwordChangedHandler}
            placeholder="Пароль"
            value={password.value}
          />
          <br />
          <span style={{ color: "#54586d", fontSize: "14px" }}>
            *Пароль должен содержать минимум 7 символов
          </span>
          <button
            className={classes["auth__button-submit"]}
            type="submit"
            disabled={!valid}
          >
            {!isSignIn ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>

        <button
          className={classes["auth__button-change-mode"]}
          onClick={() => {
            authDispatch({ type: "CLEAR" });
            setIsSignIn(!isSignIn);
          }}
        >
          {!isSignIn ? "Уже зарегистрированны?" : "Хотите зарегистрироваться?"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
