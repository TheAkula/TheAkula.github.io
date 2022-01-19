import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../../context/auth-context";

import classes from "./Auth.module.css";

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

  const { authDispatch } = useContext(AuthContext);

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
        authDispatch({
          type: "RESPONSE",
          userId: response.data.localId,
          token: response.data.idToken,
        });
      })
      .catch((err) => {
        authDispatch({ type: "CATCH", error: err });
      });
  };

  const valid = email.valid && password.valid;

  return (
    <div className={classes.AuthBlock}>
      <div className={classes.Auth}>
        <form onSubmit={onSubmitHandler}>
          <input
            className={[
              classes.Input,
              !email.valid && email.touched && email.value
                ? classes.Invalid
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
              classes.Input,
              !password.valid && password.touched && password.value
                ? classes.Invalid
                : "",
            ].join(" ")}
            ref={passwordRef}
            type="password"
            onChange={passwordChangedHandler}
            placeholder="Пароль"
            value={password.value}
          />
          <span style={{ color: "#54586d", fontSize: "14px" }}>
            *Пароль должен содержать минимум 7 символов
          </span>
          <button className={classes.Submit} type="submit" disabled={!valid}>
            {!isSignIn ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>

        <button className={classes.Link} onClick={() => setIsSignIn(!isSignIn)}>
          {!isSignIn ? "Уже зарегистрированны?" : "Хотите зарегистрироваться?"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
