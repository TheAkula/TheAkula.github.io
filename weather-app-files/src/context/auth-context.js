import React, { useReducer } from "react";

const initialState = {
  token: null,
  userId: null,
  loading: false,
  expiresIn: 0,
  error: null,
};

export const AuthContext = React.createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {
    case "RESPONSE":
      return {
        loading: false,
        token: action.token,
        userId: action.userId,
        expiresIn: action.expiresIn,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "CATCH":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case "CLEAR":
      return {
        loading: false,
        token: null,
        userId: null,
        expiresIn: 0,
        error: null,
      };
    default:
      throw new Error("No type: " + action.type);
  }
};

const AuthContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={{ authState: state, authDispatch: dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
