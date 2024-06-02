import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import { Routes } from "~routes";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import "./App.scss";

function App() {
  const [count, setCount] = useState<any>(0);

  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

export default App;
