import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import "./App.scss";

function App() {
  const [count, setCount] = useState<any>(0);

  return (
    <div className="app">
      <h1>Here we go</h1>
    </div>
  ); 
}

export default App;
