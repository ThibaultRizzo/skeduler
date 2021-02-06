import React from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./layout/Main";
import "./styles/styles.scss";

function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default App;
