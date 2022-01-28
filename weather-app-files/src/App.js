import React from "react";

import Toolbar from "./containers/Toolbar/Toolbar";
import { Routes, Route, Navigate } from "react-router";
import { Suspense, useCallback, useContext, useEffect } from "react";

import { CityContext } from "./context/city-context";
import { AuthContext } from "./context/auth-context";

import Auth from "./containers/Auth/Auth";

const Main = React.lazy(() => import("./containers/Main/Main"));
const City = React.lazy(() => import("./containers/City/City"));

function App() {
  const { cityState } = useContext(CityContext);
  const { authState, authDispatch } = useContext(AuthContext);

  const autoSignIn = useCallback(() => {
    const expiresIn = +window.localStorage.getItem("expiresIn");
    if (expiresIn > new Date().getTime()) {
      authDispatch({
        type: "RESPONSE",
        userId: window.localStorage.getItem("userId"),
        token: window.localStorage.getItem("token"),
        expiresIn: expiresIn,
      });
    } else {
      window.localStorage.clear();
    }
  }, [authDispatch]);

  useEffect(() => {
    autoSignIn();
  }, [autoSignIn]);

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
      <Toolbar />
      <main>
        <Suspense
          fallback={
            <div
              style={{
                width: "100vw",
                height: "calc(100vh - 65px)",
                background: "#161b30",
              }}
            ></div>
          }
        >
          <Routes>{routes}</Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;
