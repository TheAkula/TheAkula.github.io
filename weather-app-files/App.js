import Toolbar from "./containers/Toolbar/Toolbar";
import Main from "./containers/Main/Main";
import City from "./containers/City/City";
import { Routes, Route, Navigate } from "react-router";
import { useContext } from "react";

import { CityContext } from "./context/city-context";
import { AuthContext } from "./context/auth-context";

import classes from "./App.module.css";
import Auth from "./containers/Auth/Auth";

function App() {
  const { cityState } = useContext(CityContext);
  const { authState } = useContext(AuthContext);

  let routes = (
    <>
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Navigate to="/auth" />} />
    </>
  );

  if (authState.token !== null) {
    routes = (
      <>
        <Route path="/" element={<Main />} />
        {cityState.data ? <Route path="/city" element={<City />} /> : null}
        <Route path="*" element={<Navigate to="/" />} />
      </>
    );
  }

  return (
    <>
      <Toolbar showClass={cityState.data ? classes.Show : ""} />
      <main>
        <Routes>{routes}</Routes>
      </main>
    </>
  );
}

export default App;
