import { useContext } from "react";

import classes from "./Toolbar.module.css";
import Logo from "../../assets/images/Лого (1).svg";

import { AuthContext } from "../../context/auth-context";

const Toolbar = (props) => {
  const { authState, authDispatch } = useContext(AuthContext);

  const logoutHandler = () => {
    authDispatch({ type: "CLEAR" });
  };

  return (
    <div className={[classes.Toolbar, props.showClass].join(" ")}>
      <div className={classes.Logo}>
        <img src={Logo} alt="Weather Check" />
      </div>
      {!!authState.token && (
        <div className={classes.Logout} onClick={logoutHandler}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={classes.LogoutIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
