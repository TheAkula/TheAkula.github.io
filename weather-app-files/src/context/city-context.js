import React, { useReducer } from "react";

const initialState = {
  data: null,
  loading: false,
  isMain: false,
};

export const CityContext = React.createContext(initialState);

const reducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return {
        data: action.data,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "CLEAR":
      return {
        ...state,
        data: null,
      };
    case "REMOVE_CITY":
      return {
        ...state,
        isCity: false,
      };
    case "SET_CITY":
      return {
        ...state,
        isCity: true,
      };
    default:
      throw new Error("No type found: " + action.type);
  }
};

const CityContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CityContext.Provider value={{ cityState: state, cityDispatch: dispatch }}>
      {props.children}
    </CityContext.Provider>
  );
};

export default CityContextProvider;
