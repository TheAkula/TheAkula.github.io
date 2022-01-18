import { useContext } from "react";

import classes from "./Toolbar.module.css";

import { AuthContext } from "../../context/auth-context";

const Toolbar = (props) => {
  const { authState, authDispatch } = useContext(AuthContext);

  const logoutHandler = () => {
    authDispatch({ type: "CLEAR" });
  };
  return (
    <div className={[classes.Toolbar, props.showClass].join(" ")}>
      <div className={classes.Logo}>
        <div
          className={[classes.Logo, "svg-Лого", "svg-Лого-dims"].join(" ")}
        ></div>
      </div>
      {!!authState.token && (
        <div className={classes.Logout} onClick={logoutHandler}>
          <div className="svg-Logout svg-Logout-dims"></div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
