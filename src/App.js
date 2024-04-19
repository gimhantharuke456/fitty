import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Views/Home";
import "antd/dist/reset.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
