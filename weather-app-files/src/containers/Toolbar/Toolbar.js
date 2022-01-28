import { useContext } from "react";

import classes from "./Toolbar.module.css";

import { AuthContext } from "../../context/auth-context";
import { CityContext } from "../../context/city-context";

const Toolbar = () => {
  const { authState, authDispatch } = useContext(AuthContext);
  const { cityState } = useContext(CityContext);

  const logoutHandler = () => {
    window.localStorage.clear();
    authDispatch({ type: "CLEAR" });
  };
  return (
    <div
      className={[
        classes.toolbar,
        cityState.isCity ? classes.toolbar_show : "",
      ].join(" ")}
    >
      <div className={classes["toolbar__logo"]}>
        <div className={["svg-Лого", "svg-Лого-dims"].join(" ")}></div>
      </div>
      {!!authState.token && (
        <div className={classes["toolbar__logout"]} onClick={logoutHandler}>
          <div className="svg-Logout svg-Logout-dims"></div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
